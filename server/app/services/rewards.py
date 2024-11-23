from typing import Dict, List
from datetime import datetime, timedelta
import random

class RewardsService:
    def __init__(self):
        self._user_points = {}  # User points storage
        self._trading_multipliers = {
            "win_streak": 1.2,
            "volume": 1.1,
            "risk_level": 1.15
        }
        self._achievements = {
            "first_trade": {"points": 100, "title": "First Trade"},
            "win_streak_5": {"points": 500, "title": "5 Wins in a Row"},
            "volume_milestone": {"points": 1000, "title": "Volume Master"}
        }
        
    async def calculate_trade_points(self, user_id: str, trade_amount: float, 
                                  outcome: str, risk_level: float) -> Dict:
        """Calculate points for a trade"""
        base_points = trade_amount * 0.1  # Base points as 10% of trade amount
        
        # Apply multipliers
        if outcome == "win":
            base_points *= self._trading_multipliers["win_streak"]
        base_points *= (1 + (risk_level * self._trading_multipliers["risk_level"]))
        
        # Update user points
        current_points = self._user_points.get(user_id, 0)
        self._user_points[user_id] = current_points + base_points
        
        return {
            "points_earned": base_points,
            "total_points": self._user_points[user_id],
            "multipliers_applied": list(self._trading_multipliers.keys())
        }
    
    async def get_user_achievements(self, user_id: str) -> List[Dict]:
        """Get user's achievements"""
        # Dummy implementation - randomly assign achievements
        user_achievements = []
        for achievement_id, details in self._achievements.items():
            if random.random() > 0.5:  # 50% chance of having each achievement
                user_achievements.append({
                    "id": achievement_id,
                    "title": details["title"],
                    "points": details["points"],
                    "achieved_at": datetime.now() - timedelta(days=random.randint(1, 30))
                })
        return user_achievements
    
    async def get_leaderboard(self, timeframe: str = "weekly") -> List[Dict]:
        """Get points leaderboard"""
        # Generate dummy leaderboard data
        leaderboard = []
        for i in range(10):
            leaderboard.append({
                "rank": i + 1,
                "user_id": f"user_{i}",
                "points": random.randint(1000, 10000),
                "win_rate": random.uniform(0.4, 0.8)
            })
        return sorted(leaderboard, key=lambda x: x["points"], reverse=True)
    
    async def calculate_referral_rewards(self, referrer_id: str, 
                                      referee_trade_volume: float) -> Dict:
        """Calculate referral rewards"""
        referral_rate = 0.05  # 5% referral reward
        points_earned = referee_trade_volume * referral_rate
        
        current_points = self._user_points.get(referrer_id, 0)
        self._user_points[referrer_id] = current_points + points_earned
        
        return {
            "points_earned": points_earned,
            "total_points": self._user_points[referrer_id],
            "referral_rate": referral_rate
        }
    
    async def get_user_stats(self, user_id: str) -> Dict:
        """Get user's reward stats"""
        return {
            "total_points": self._user_points.get(user_id, 0),
            "rank": random.randint(1, 1000),
            "achievements_count": len(await self.get_user_achievements(user_id)),
            "referral_earnings": random.randint(100, 1000)
        }
