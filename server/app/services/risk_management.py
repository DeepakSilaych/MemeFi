from typing import Dict, List, Optional
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import User, Trade, Token, MarketData
from app.models.database import SessionLocal
from app.services.websocket import ws_manager
from datetime import datetime, timedelta
import numpy as np
import logging

logger = logging.getLogger(__name__)

class RiskManagementService:
    def __init__(self):
        self._position_limits = {
            "default": 1000.0,  # Default position size limit
            "max_leverage": 5,   # Maximum leverage allowed
        }
        self._risk_scores = {}  # User risk scores
        
    async def calculate_position_limit(self, user_id: str, token: str) -> float:
        """Calculate maximum position size for a user"""
        base_limit = self._position_limits["default"]
        risk_score = self._risk_scores.get(user_id, 0.8)  # Default risk score
        return base_limit * risk_score
    
    async def validate_position(self, user_id: str, token: str, amount: float, leverage: float = 1.0) -> Dict:
        """Validate if a position can be opened"""
        max_position = await self.calculate_position_limit(user_id, token)
        is_valid = amount <= max_position and leverage <= self._position_limits["max_leverage"]
        
        return {
            "is_valid": is_valid,
            "max_position": max_position,
            "max_leverage": self._position_limits["max_leverage"],
            "reason": None if is_valid else "Position size or leverage exceeds limits"
        }
    
    async def calculate_liquidation_price(self, entry_price: float, position_size: float, 
                                       leverage: float, direction: str) -> float:
        """Calculate liquidation price for a position"""
        margin = position_size / leverage
        liquidation_threshold = 0.8  # 80% of margin
        
        if direction == "long":
            return entry_price * (1 - (margin * liquidation_threshold / position_size))
        else:
            return entry_price * (1 + (margin * liquidation_threshold / position_size))
    
    async def get_risk_metrics(self, token: str) -> Dict:
        """Get risk metrics for a token"""
        return {
            "volatility": random.uniform(0.1, 0.5),
            "liquidity_score": random.uniform(0.5, 1.0),
            "market_risk": random.uniform(0.1, 0.8),
            "recommended_position_size": self._position_limits["default"] * random.uniform(0.5, 1.0)
        }
    
    async def update_user_risk_score(self, user_id: str, position_outcome: str) -> float:
        """Update user's risk score based on position outcome"""
        current_score = self._risk_scores.get(user_id, 0.8)
        
        if position_outcome == "profit":
            self._risk_scores[user_id] = min(1.0, current_score + 0.05)
        elif position_outcome == "loss":
            self._risk_scores[user_id] = max(0.5, current_score - 0.05)
            
        return self._risk_scores[user_id]

class RiskManager:
    def __init__(self):
        self.max_position_size = 100000  # $100k max position
        self.max_leverage = 10           # 10x max leverage
        self.max_daily_loss = 0.25       # 25% max daily loss
        self.volatility_threshold = 0.5   # 50% volatility threshold
        
    def calculate_volatility(self, prices: List[float]) -> float:
        """Calculate price volatility using standard deviation"""
        if len(prices) < 2:
            return 0
        returns = np.diff(prices) / prices[:-1]
        return float(np.std(returns))
    
    def calculate_var(self, position_value: float, volatility: float, confidence: float = 0.95) -> float:
        """Calculate Value at Risk"""
        z_score = 1.645  # 95% confidence level
        return position_value * volatility * z_score
    
    async def check_position_risk(self, db: Session, user_id: str, token_symbol: str, 
                                position_size: float, leverage: float = 1.0) -> Dict:
        """Check if a position meets risk requirements"""
        try:
            # Get token data
            token = db.query(Token).filter(Token.symbol == token_symbol).first()
            if not token:
                return {"allowed": False, "reason": "Token not found"}
            
            # Get recent market data
            market_data = (db.query(MarketData)
                         .filter(MarketData.token_id == token.id)
                         .order_by(MarketData.timestamp.desc())
                         .limit(24)  # Last 24 data points
                         .all())
            
            prices = [data.price for data in market_data]
            
            # Calculate risk metrics
            volatility = self.calculate_volatility(prices)
            position_value = position_size * token.current_price
            var = self.calculate_var(position_value, volatility)
            
            # Check risk limits
            risk_checks = {
                "position_size": position_value <= self.max_position_size,
                "leverage": leverage <= self.max_leverage,
                "volatility": volatility <= self.volatility_threshold
            }
            
            # Calculate risk score (0-100)
            risk_score = (
                (position_value / self.max_position_size) * 30 +
                (leverage / self.max_leverage) * 40 +
                (volatility / self.volatility_threshold) * 30
            )
            
            risk_data = {
                "allowed": all(risk_checks.values()),
                "risk_score": min(risk_score, 100),
                "metrics": {
                    "position_value": position_value,
                    "volatility": volatility,
                    "var_95": var,
                    "leverage": leverage
                },
                "limits": {
                    "position_size": self.max_position_size,
                    "leverage": self.max_leverage,
                    "volatility": self.volatility_threshold
                }
            }
            
            # Send risk alert if score is high
            if risk_score > 70:
                await ws_manager.send_risk_alert(user_id, {
                    "level": "high",
                    "score": risk_score,
                    "message": f"High risk position detected for {token_symbol}",
                    "details": risk_data
                })
            
            return risk_data
            
        except Exception as e:
            logger.error(f"Error checking position risk: {str(e)}")
            return {"allowed": False, "reason": f"Error checking risk: {str(e)}"}
    
    async def monitor_user_positions(self, db: Session, user_id: str) -> Dict:
        """Monitor all positions for a user"""
        try:
            # Get user's active trades
            trades = (db.query(Trade)
                     .filter(Trade.user_id == user_id)
                     .filter(Trade.is_open == True)
                     .all())
            
            total_exposure = 0
            position_risks = []
            
            for trade in trades:
                risk_data = await self.check_position_risk(
                    db, user_id, trade.token.symbol, 
                    trade.position_size, trade.leverage
                )
                
                position_risks.append({
                    "trade_id": trade.id,
                    "token": trade.token.symbol,
                    "risk_data": risk_data
                })
                
                total_exposure += trade.position_size * trade.token.current_price
            
            # Check daily P&L
            daily_pnl = self.calculate_daily_pnl(db, user_id)
            if daily_pnl and abs(daily_pnl) > self.max_daily_loss:
                await ws_manager.send_risk_alert(user_id, {
                    "level": "critical",
                    "message": f"Daily loss limit exceeded: {daily_pnl:.2%}",
                    "max_loss": self.max_daily_loss
                })
            
            return {
                "total_exposure": total_exposure,
                "daily_pnl": daily_pnl,
                "position_risks": position_risks
            }
            
        except Exception as e:
            logger.error(f"Error monitoring positions: {str(e)}")
            return {"error": f"Failed to monitor positions: {str(e)}"}
    
    def calculate_daily_pnl(self, db: Session, user_id: str) -> Optional[float]:
        """Calculate user's daily P&L"""
        try:
            today = datetime.utcnow().date()
            yesterday = today - timedelta(days=1)
            
            trades = (db.query(Trade)
                     .filter(Trade.user_id == user_id)
                     .filter(Trade.timestamp >= yesterday)
                     .all())
            
            if not trades:
                return None
            
            total_pnl = sum(trade.realized_pnl for trade in trades if trade.realized_pnl)
            initial_balance = sum(trade.initial_margin for trade in trades)
            
            if initial_balance == 0:
                return 0
                
            return total_pnl / initial_balance
            
        except Exception as e:
            logger.error(f"Error calculating daily P&L: {str(e)}")
            return None

# Global risk manager instance
risk_manager = RiskManager()
