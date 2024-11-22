from typing import Dict, List, Optional
from .coingecko_service import CoinGeckoService
from .dex_service import DexService
import logging

logger = logging.getLogger(__name__)

class TokenService:
    """Primary service for token data, using CoinGecko as primary source with optional 1inch integration"""
    
    def __init__(self):
        self.coingecko = CoinGeckoService()
        try:
            self.dex = DexService()
            self.has_dex = bool(self.dex.one_inch_api_key)
        except Exception as e:
            logger.warning(f"Failed to initialize DEX service: {e}")
            self.has_dex = False

    async def get_token_list(self, limit: int = 50) -> List[Dict]:
        """Get list of top meme tokens"""
        return await self.coingecko.get_meme_tokens(limit)

    async def get_token_details(self, token_id: str) -> Dict:
        """Get detailed token information with optional DEX pricing"""
        token_data = await self.coingecko.get_token_details(token_id)
        
        if self.has_dex and token_data.get("contract_address"):
            try:
                # Try to get additional DEX pricing data
                dex_price = await self.dex.get_token_price(
                    token_data["contract_address"],
                    chain=token_data.get("asset_platform_id", "ethereum")
                )
                token_data["dex_data"] = dex_price
            except Exception as e:
                logger.warning(f"Failed to fetch DEX price for {token_id}: {e}")
        
        return token_data

    async def get_token_price_history(self, token_id: str, days: int = 7) -> List[Dict]:
        """Get historical price data"""
        return await self.coingecko.get_token_price_history(token_id, days)

    async def get_market_overview(self) -> Dict:
        """Get meme token market overview"""
        tokens = await self.get_token_list(10)  # Top 10 meme tokens
        
        total_market_cap = sum(token["market_cap"] for token in tokens if token.get("market_cap"))
        total_volume_24h = sum(token["volume_24h"] for token in tokens if token.get("volume_24h"))
        
        # Calculate average 24h price change
        price_changes = [token["price_change_24h"] for token in tokens if token.get("price_change_24h") is not None]
        avg_price_change = sum(price_changes) / len(price_changes) if price_changes else 0
        
        return {
            "total_market_cap": total_market_cap,
            "total_volume_24h": total_volume_24h,
            "average_price_change_24h": avg_price_change,
            "top_tokens": tokens
        }

    async def get_token_swapping_options(self, from_token: str, to_token: str, amount: float) -> Optional[Dict]:
        """Get token swapping options if DEX integration is available"""
        if not self.has_dex:
            return None
            
        try:
            return await self.dex.get_swap_quote(from_token, to_token, amount)
        except Exception as e:
            logger.error(f"Failed to get swap quote: {e}")
            return None
