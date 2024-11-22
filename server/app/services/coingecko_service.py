import os
import aiohttp
import asyncio
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from ..core.config import get_settings

settings = get_settings()

class CoinGeckoService:
    BASE_URL = "https://api.coingecko.com/api/v3"
    
    def __init__(self):
        self.api_key = os.getenv("COINGECKO_API_KEY")
        self.headers = {"x-cg-pro-api-key": self.api_key} if self.api_key else {}
        self.cache = {}
        self.cache_ttl = timedelta(minutes=5)
        self.last_request_time = datetime.now()
        self.rate_limit_delay = 1.5  # seconds between requests for free tier

    async def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """Make rate-limited API request to CoinGecko"""
        # Respect rate limits
        time_since_last = datetime.now() - self.last_request_time
        if time_since_last.total_seconds() < self.rate_limit_delay:
            await asyncio.sleep(self.rate_limit_delay - time_since_last.total_seconds())
        
        url = f"{self.BASE_URL}/{endpoint}"
        cache_key = f"{url}:{str(params)}"
        
        # Check cache
        if cache_key in self.cache:
            cached_data, cached_time = self.cache[cache_key]
            if datetime.now() - cached_time < self.cache_ttl:
                return cached_data

        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, params=params, headers=self.headers) as response:
                    self.last_request_time = datetime.now()
                    if response.status == 429:  # Rate limit exceeded
                        raise Exception("Rate limit exceeded. Please try again later.")
                    response.raise_for_status()
                    data = await response.json()
                    self.cache[cache_key] = (data, datetime.now())
                    return data
            except aiohttp.ClientError as e:
                raise Exception(f"Error fetching data from CoinGecko: {str(e)}")

    async def get_meme_tokens(self, limit: int = 50) -> List[Dict]:
        """Get top meme tokens by market cap"""
        params = {
            "vs_currency": "usd",
            "category": "meme-token",
            "order": "market_cap_desc",
            "per_page": limit,
            "page": 1,
            "sparkline": False
        }
        data = await self._make_request("coins/markets", params)
        return [{
            "id": token["id"],
            "symbol": token["symbol"].upper(),
            "name": token["name"],
            "image": token["image"],
            "current_price": token["current_price"],
            "market_cap": token["market_cap"],
            "market_cap_rank": token["market_cap_rank"],
            "price_change_24h": token["price_change_percentage_24h"],
            "volume_24h": token["total_volume"]
        } for token in data]

    async def get_token_details(self, token_id: str) -> Dict:
        """Get detailed information about a specific token"""
        data = await self._make_request(f"coins/{token_id}", {
            "localization": False,
            "tickers": True,
            "market_data": True,
            "community_data": True,
            "developer_data": False
        })
        return {
            "id": data["id"],
            "symbol": data["symbol"].upper(),
            "name": data["name"],
            "description": data.get("description", {}).get("en", ""),
            "image": data["image"]["large"],
            "market_data": {
                "current_price": data["market_data"]["current_price"]["usd"],
                "market_cap": data["market_data"]["market_cap"]["usd"],
                "total_volume": data["market_data"]["total_volume"]["usd"],
                "price_change_24h": data["market_data"]["price_change_percentage_24h"],
                "price_change_7d": data["market_data"]["price_change_percentage_7d"],
                "price_change_30d": data["market_data"]["price_change_percentage_30d"],
                "ath": data["market_data"]["ath"]["usd"],
                "ath_date": data["market_data"]["ath_date"]["usd"],
                "atl": data["market_data"]["atl"]["usd"],
                "atl_date": data["market_data"]["atl_date"]["usd"]
            },
            "community": {
                "twitter_followers": data.get("community_data", {}).get("twitter_followers", 0),
                "reddit_subscribers": data.get("community_data", {}).get("reddit_subscribers", 0),
                "telegram_channel_user_count": data.get("community_data", {}).get("telegram_channel_user_count", 0)
            }
        }

    async def get_token_price_history(self, token_id: str, days: int = 7) -> List[Dict]:
        """Get historical price data for a token"""
        data = await self._make_request(f"coins/{token_id}/market_chart", {
            "vs_currency": "usd",
            "days": days,
            "interval": "daily" if days > 30 else "hourly"
        })
        
        prices = data["prices"]
        return [{
            "timestamp": int(price[0]),
            "price": price[1]
        } for price in prices]
