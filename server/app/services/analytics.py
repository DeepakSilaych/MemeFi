from typing import Dict, List, Optional
from datetime import datetime, timedelta
import random

class AnalyticsService:
    def __init__(self):
        self._user_stats = {}  # User trading statistics
        self._platform_stats = {
            "total_volume": 0,
            "total_trades": 0,
            "total_users": 0
        }
        
    async def track_trade(self, user_id: str, trade_data: Dict) -> None:
        """Track a new trade for analytics"""
        if user_id not in self._user_stats:
            self._user_stats[user_id] = {
                "total_trades": 0,
                "winning_trades": 0,
                "total_volume": 0,
                "pnl": 0
            }
            
        # Update user stats
        self._user_stats[user_id]["total_trades"] += 1
        self._user_stats[user_id]["total_volume"] += trade_data.get("amount", 0)
        
        if trade_data.get("outcome") == "win":
            self._user_stats[user_id]["winning_trades"] += 1
            self._user_stats[user_id]["pnl"] += trade_data.get("profit", 0)
        else:
            self._user_stats[user_id]["pnl"] -= trade_data.get("loss", 0)
            
        # Update platform stats
        self._platform_stats["total_volume"] += trade_data.get("amount", 0)
        self._platform_stats["total_trades"] += 1
        
    async def get_user_analytics(self, user_id: str) -> Dict:
        """Get analytics for a specific user"""
        if user_id not in self._user_stats:
            return {
                "total_trades": 0,
                "win_rate": 0,
                "total_volume": 0,
                "pnl": 0,
                "avg_trade_size": 0
            }
            
        stats = self._user_stats[user_id]
        return {
            "total_trades": stats["total_trades"],
            "win_rate": stats["winning_trades"] / stats["total_trades"] if stats["total_trades"] > 0 else 0,
            "total_volume": stats["total_volume"],
            "pnl": stats["pnl"],
            "avg_trade_size": stats["total_volume"] / stats["total_trades"] if stats["total_trades"] > 0 else 0
        }
    
    async def get_platform_analytics(self) -> Dict:
        """Get overall platform analytics"""
        return {
            "total_volume": self._platform_stats["total_volume"],
            "total_trades": self._platform_stats["total_trades"],
            "total_users": len(self._user_stats),
            "avg_trade_size": (self._platform_stats["total_volume"] / 
                             self._platform_stats["total_trades"] if self._platform_stats["total_trades"] > 0 else 0)
        }
    
    async def get_token_analytics(self, token_id: str) -> Dict:
        """Get analytics for a specific token"""
        return {
            "total_trades": random.randint(100, 1000),
            "total_volume": random.uniform(100000, 1000000),
            "unique_traders": random.randint(50, 500),
            "avg_trade_size": random.uniform(100, 1000),
            "win_rate": random.uniform(0.4, 0.6),
            "price_correlation": {
                "BTC": random.uniform(-1, 1),
                "ETH": random.uniform(-1, 1)
            }
        }
    
    async def get_trading_patterns(self, user_id: str) -> Dict:
        """Analyze user's trading patterns"""
        return {
            "preferred_tokens": ["DOGE", "SHIB", "PEPE"],
            "avg_hold_time": random.uniform(1, 24),  # hours
            "preferred_timeframes": ["1m", "5m"],
            "risk_profile": random.choice(["conservative", "moderate", "aggressive"]),
            "best_performing_token": random.choice(["DOGE", "SHIB", "PEPE"]),
            "worst_performing_token": random.choice(["DOGE", "SHIB", "PEPE"])
        }
    
    async def get_market_sentiment(self) -> Dict:
        """Get overall market sentiment analysis"""
        return {
            "overall_sentiment": random.choice(["bullish", "neutral", "bearish"]),
            "sentiment_score": random.uniform(-1, 1),
            "trending_tokens": [
                {"token": "DOGE", "sentiment": random.uniform(-1, 1)},
                {"token": "SHIB", "sentiment": random.uniform(-1, 1)},
                {"token": "PEPE", "sentiment": random.uniform(-1, 1)}
            ],
            "market_momentum": random.choice(["increasing", "stable", "decreasing"]),
            "updated_at": datetime.now().isoformat()
        }
