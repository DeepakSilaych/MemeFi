import random
from datetime import datetime, timedelta
from .meme_tokens import MemeTokenService

class TradingService:
    def __init__(self):
        self.active_positions = {}
        self.trade_history = {}
        self.meme_token_service = MemeTokenService()

    async def get_token_list(self):
        """Get list of tradeable tokens with current prices"""
        return await self.meme_token_service.get_token_list()

    async def get_token_price(self, token_id: str) -> float:
        """Get current price for a token"""
        token_data = await self.meme_token_service.get_token_details(token_id)
        if token_data:
            return token_data["price"]
        return 0

    async def open_position(self, user_id: str, token: str, amount: float, direction: str, duration: int):
        """Open a new trading position"""
        position_id = f"pos_{len(self.active_positions) + 1}"
        entry_price = await self.get_token_price(token)
        
        position = {
            "id": position_id,
            "user_id": user_id,
            "token": token,
            "amount": amount,
            "direction": direction,
            "entry_price": entry_price,
            "entry_time": datetime.now(),
            "duration": duration,
            "status": "open"
        }
        
        self.active_positions[position_id] = position
        return position

    async def close_position(self, position_id: str):
        """Close an existing position"""
        if position_id not in self.active_positions:
            raise ValueError("Position not found")
            
        position = self.active_positions[position_id]
        exit_price = await self.get_token_price(position["token"])
        
        # Calculate PnL
        price_diff = exit_price - position["entry_price"]
        if position["direction"] == "DOWN":
            price_diff = -price_diff
            
        pnl = price_diff * position["amount"] / position["entry_price"]
        
        # Update position
        position["exit_price"] = exit_price
        position["exit_time"] = datetime.now()
        position["pnl"] = pnl
        position["status"] = "closed"
        
        # Move to history
        self.trade_history[position_id] = position
        del self.active_positions[position_id]
        
        return position

    async def get_user_positions(self, user_id: str):
        """Get all positions for a user"""
        active = [pos for pos in self.active_positions.values() if pos["user_id"] == user_id]
        history = [pos for pos in self.trade_history.values() if pos["user_id"] == user_id]
        return {"active": active, "history": history}
