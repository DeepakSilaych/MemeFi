from typing import Dict, List, Optional
from datetime import datetime, timedelta
import random

class MarketDataService:
    def __init__(self):
        self._supported_tokens = {
            "PEPE": {"name": "Pepe", "symbol": "PEPE"},
            "DOGE": {"name": "Dogecoin", "symbol": "DOGE"},
            "SHIB": {"name": "Shiba Inu", "symbol": "SHIB"},
            "FLOKI": {"name": "Floki", "symbol": "FLOKI"}
        }
        self._price_data = {}  # Cache for price data
        
    async def get_token_price(self, token_id: str) -> Optional[Dict]:
        """Get current price for a token"""
        if token_id not in self._supported_tokens:
            return None
            
        # Generate dummy price data
        base_price = random.uniform(0.0001, 1.0)
        return {
            "price": base_price,
            "change_24h": random.uniform(-10, 10),
            "volume_24h": random.uniform(1000000, 10000000),
            "timestamp": datetime.now().isoformat()
        }
    
    async def get_price_history(self, token_id: str, 
                              timeframe: str = "1d") -> List[Dict]:
        """Get historical price data"""
        if token_id not in self._supported_tokens:
            return []
            
        # Generate dummy historical data
        history = []
        base_price = random.uniform(0.0001, 1.0)
        intervals = 24 if timeframe == "1d" else 7 * 24  # 1d or 1w
        
        for i in range(intervals):
            timestamp = datetime.now() - timedelta(hours=i)
            price = base_price * (1 + random.uniform(-0.1, 0.1))
            history.append({
                "timestamp": timestamp.isoformat(),
                "price": price,
                "volume": random.uniform(10000, 100000)
            })
            
        return sorted(history, key=lambda x: x["timestamp"])
    
    async def get_market_summary(self) -> Dict:
        """Get overall market summary"""
        total_volume = 0
        gainers = []
        losers = []
        
        for token_id in self._supported_tokens:
            price_data = await self.get_token_price(token_id)
            if price_data:
                total_volume += price_data["volume_24h"]
                token_info = {
                    "id": token_id,
                    "name": self._supported_tokens[token_id]["name"],
                    "change": price_data["change_24h"]
                }
                if price_data["change_24h"] > 0:
                    gainers.append(token_info)
                else:
                    losers.append(token_info)
                    
        return {
            "total_volume_24h": total_volume,
            "top_gainers": sorted(gainers, key=lambda x: x["change"], reverse=True)[:3],
            "top_losers": sorted(losers, key=lambda x: x["change"])[:3],
            "timestamp": datetime.now().isoformat()
        }
    
    async def get_token_metrics(self, token_id: str) -> Optional[Dict]:
        """Get detailed metrics for a token"""
        if token_id not in self._supported_tokens:
            return None
            
        return {
            "market_cap": random.uniform(1000000, 1000000000),
            "fully_diluted_valuation": random.uniform(2000000, 2000000000),
            "circulating_supply": random.uniform(1000000, 1000000000),
            "total_supply": random.uniform(2000000, 2000000000),
            "holders": random.randint(1000, 100000),
            "transactions_24h": random.randint(1000, 10000)
        }
    
    async def get_liquidity_data(self, token_id: str) -> Optional[Dict]:
        """Get liquidity information for a token"""
        if token_id not in self._supported_tokens:
            return None
            
        return {
            "total_liquidity": random.uniform(100000, 1000000),
            "liquidity_pairs": [
                {
                    "pair": f"{token_id}/USDT",
                    "liquidity": random.uniform(50000, 500000),
                    "volume_24h": random.uniform(10000, 100000)
                },
                {
                    "pair": f"{token_id}/ETH",
                    "liquidity": random.uniform(50000, 500000),
                    "volume_24h": random.uniform(10000, 100000)
                }
            ],
            "updated_at": datetime.now().isoformat()
        }
