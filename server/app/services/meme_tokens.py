import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class MemeTokenService:
    def __init__(self):
        self.base_url = "https://api.coingecko.com/api/v3"
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes cache

    async def get_token_list(self) -> List[Dict]:
        """Get list of meme tokens from CoinGecko"""
        cache_key = "token_list"
        if cache_key in self.cache:
            cache_time, data = self.cache[cache_key]
            if datetime.now() - cache_time < timedelta(seconds=self.cache_ttl):
                return data

        try:
            response = requests.get(
                f"{self.base_url}/coins/markets",
                params={
                    "vs_currency": "usd",
                    "category": "meme-token",
                    "order": "market_cap_desc",
                    "per_page": 50,
                    "page": 1,
                    "sparkline": False
                }
            )
            response.raise_for_status()
            tokens = response.json()
            
            formatted_tokens = [{
                "symbol": token["symbol"].upper(),
                "name": token["name"],
                "price": token["current_price"],
                "price_change_24h": token["price_change_percentage_24h"] or 0,
                "volume_24h": token["total_volume"] or 0,
                "market_cap": token["market_cap"] or 0,
                "image": token["image"],
                "total_supply": token["total_supply"] or 0,
            } for token in tokens]

            self.cache[cache_key] = (datetime.now(), formatted_tokens)
            return formatted_tokens
        except Exception as e:
            print(f"Error fetching token list: {str(e)}")
            return []

    async def get_token_details(self, token_id: str) -> Optional[Dict]:
        """Get detailed information about a specific token"""
        cache_key = f"token_details_{token_id}"
        if cache_key in self.cache:
            cache_time, data = self.cache[cache_key]
            if datetime.now() - cache_time < timedelta(seconds=self.cache_ttl):
                return data

        try:
            response = requests.get(
                f"{self.base_url}/coins/{token_id}",
                params={
                    "localization": False,
                    "tickers": False,
                    "market_data": True,
                    "community_data": False,
                    "developer_data": False
                }
            )
            response.raise_for_status()
            token = response.json()

            token_data = {
                "id": token["id"],
                "symbol": token["symbol"].upper(),
                "name": token["name"],
                "description": token["description"]["en"],
                "image": token["image"]["large"],
                "price": token["market_data"]["current_price"]["usd"],
                "price_change_24h": token["market_data"]["price_change_percentage_24h"] or 0,
                "volume_24h": token["market_data"]["total_volume"]["usd"] or 0,
                "market_cap": token["market_data"]["market_cap"]["usd"] or 0,
                "total_supply": token["market_data"]["total_supply"] or 0,
            }

            self.cache[cache_key] = (datetime.now(), token_data)
            return token_data
        except Exception as e:
            print(f"Error fetching token details: {str(e)}")
            return None

    async def get_token_price_history(self, token_id: str, days: int = 1) -> List[Dict]:
        """Get historical price data for a token"""
        cache_key = f"price_history_{token_id}_{days}"
        if cache_key in self.cache:
            cache_time, data = self.cache[cache_key]
            if datetime.now() - cache_time < timedelta(seconds=self.cache_ttl):
                return data

        try:
            response = requests.get(
                f"{self.base_url}/coins/{token_id}/market_chart",
                params={
                    "vs_currency": "usd",
                    "days": days,
                }
            )
            response.raise_for_status()
            data = response.json()

            price_history = [
                {
                    "timestamp": datetime.fromtimestamp(timestamp / 1000).isoformat(),
                    "price": price
                }
                for timestamp, price in data["prices"]
            ]

            self.cache[cache_key] = (datetime.now(), price_history)
            return price_history
        except Exception as e:
            print(f"Error fetching price history: {str(e)}")
            return []
