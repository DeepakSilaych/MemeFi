import asyncio
import aiohttp
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import Token, MarketData
from app.models.database import SessionLocal
from app.services.websocket import ws_manager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
UPDATE_INTERVAL = 60  # seconds

# Map our tokens to CoinGecko IDs
TOKEN_MAP = {
    "INJ": "injective-protocol",
    "PEPE": "pepe",
    "DOGE": "dogecoin",
}

async def fetch_token_data(session: aiohttp.ClientSession, token_id: str):
    """Fetch token price data from CoinGecko"""
    try:
        url = f"{COINGECKO_API_URL}/simple/price"
        params = {
            "ids": token_id,
            "vs_currencies": "usd",
            "include_24hr_vol": True,
            "include_24hr_change": True,
            "include_market_cap": True,
        }
        
        async with session.get(url, params=params) as response:
            if response.status == 200:
                data = await response.json()
                return data.get(token_id, {})
            else:
                logger.error(f"Error fetching price for {token_id}: {response.status}")
                return None
    except Exception as e:
        logger.error(f"Exception fetching price for {token_id}: {str(e)}")
        return None

async def update_token_prices():
    """Update token prices in the database and broadcast via WebSocket"""
    db = SessionLocal()
    try:
        async with aiohttp.ClientSession() as session:
            for symbol, coingecko_id in TOKEN_MAP.items():
                price_data = await fetch_token_data(session, coingecko_id)
                
                if price_data:
                    token = db.query(Token).filter(Token.symbol == symbol).first()
                    if token:
                        # Update token data
                        token.current_price = price_data.get("usd", 0)
                        token.price_change_24h = price_data.get("usd_24h_change", 0)
                        token.volume_24h = price_data.get("usd_24h_vol", 0)
                        token.market_cap = price_data.get("usd_market_cap", 0)
                        
                        # Create market data entry
                        market_data = MarketData(
                            token_id=token.id,
                            price=token.current_price,
                            volume=token.volume_24h,
                            timestamp=datetime.utcnow(),
                            open=token.current_price,  # Simplified for now
                            high=token.current_price,
                            low=token.current_price,
                            close=token.current_price
                        )
                        db.add(market_data)
                        
                        # Broadcast update via WebSocket
                        await ws_manager.broadcast_price_update({
                            "symbol": symbol,
                            "price": token.current_price,
                            "price_change_24h": token.price_change_24h,
                            "volume_24h": token.volume_24h,
                            "market_cap": token.market_cap
                        })
                        
                        logger.info(f"Updated price for {symbol}: ${token.current_price}")
                    
            db.commit()
    except Exception as e:
        logger.error(f"Error updating prices: {str(e)}")
        db.rollback()
    finally:
        db.close()

async def price_feed_loop():
    """Main loop to continuously update prices"""
    while True:
        try:
            await update_token_prices()
        except Exception as e:
            logger.error(f"Error in price feed loop: {str(e)}")
        
        await asyncio.sleep(UPDATE_INTERVAL)

def start_price_feed():
    """Start the price feed service"""
    loop = asyncio.get_event_loop()
    try:
        loop.create_task(price_feed_loop())
        logger.info("Price feed service started")
    except Exception as e:
        logger.error(f"Failed to start price feed: {str(e)}")

if __name__ == "__main__":
    start_price_feed()
    try:
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        logger.info("Price feed service stopped")
