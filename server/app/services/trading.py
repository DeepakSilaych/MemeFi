from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import Trade, Token, User
from app.services.mock_chain import mock_chain
from app.services.websocket import ws_manager
from app.services.risk_management import risk_manager
import logging

logger = logging.getLogger(__name__)

class TradingService:
    async def place_trade(
        self,
        db: Session,
        user_id: str,
        wallet_address: str,
        token_symbol: str,
        side: str,
        size: float,
        price: float,
        leverage: float = 1.0
    ) -> Dict:
        """Place a new trade"""
        try:
            # Get token
            token = db.query(Token).filter(Token.symbol == token_symbol).first()
            if not token:
                raise ValueError(f"Token {token_symbol} not found")
            
            # Check risk limits
            risk_check = await risk_manager.check_position_risk(
                db, user_id, token_symbol, size, leverage
            )
            if not risk_check["allowed"]:
                raise ValueError(f"Risk check failed: {risk_check.get('reason')}")
            
            # Place order on chain
            order_data = {
                "token": token_symbol,
                "side": side,
                "size": size,
                "price": price,
                "leverage": leverage
            }
            order = await mock_chain.place_order(wallet_address, order_data)
            
            if order["status"] == "FILLED":
                # Create trade record
                trade = Trade(
                    user_id=user_id,
                    token_id=token.id,
                    side=side,
                    size=size,
                    price=price,
                    leverage=leverage,
                    position_id=order["position_id"],
                    status="OPEN",
                    timestamp=datetime.utcnow()
                )
                db.add(trade)
                db.commit()
                
                # Broadcast trade update
                await ws_manager.broadcast_trade_update({
                    "trade_id": trade.id,
                    "user_id": user_id,
                    "token": token_symbol,
                    "side": side,
                    "size": size,
                    "price": price,
                    "leverage": leverage,
                    "status": "OPEN"
                })
                
                return {
                    "success": True,
                    "trade": trade,
                    "order": order,
                    "risk_data": risk_check
                }
            else:
                return {
                    "success": False,
                    "error": order.get("error", "Order failed"),
                    "order": order
                }
                
        except Exception as e:
            logger.error(f"Error placing trade: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def close_trade(
        self,
        db: Session,
        user_id: str,
        wallet_address: str,
        trade_id: int
    ) -> Dict:
        """Close an existing trade"""
        try:
            # Get trade
            trade = db.query(Trade).filter(
                Trade.id == trade_id,
                Trade.user_id == user_id,
                Trade.status == "OPEN"
            ).first()
            
            if not trade:
                raise ValueError("Trade not found or already closed")
            
            # Close position on chain
            position = await mock_chain.close_position(wallet_address, trade.position_id)
            
            # Update trade record
            trade.status = "CLOSED"
            trade.close_price = position["entry_price"]  # Using entry price as close price for demo
            trade.realized_pnl = position["final_pnl"]
            trade.close_timestamp = datetime.utcnow()
            
            db.commit()
            
            # Broadcast trade update
            await ws_manager.broadcast_trade_update({
                "trade_id": trade.id,
                "user_id": user_id,
                "token": trade.token.symbol,
                "status": "CLOSED",
                "pnl": position["final_pnl"]
            })
            
            return {
                "success": True,
                "trade": trade,
                "position": position
            }
            
        except Exception as e:
            logger.error(f"Error closing trade: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_user_positions(
        self,
        db: Session,
        user_id: str,
        wallet_address: str
    ) -> List[Dict]:
        """Get all open positions for a user"""
        try:
            # Get positions from chain
            chain_positions = await mock_chain.get_positions(wallet_address)
            
            # Get trades from database
            trades = db.query(Trade).filter(
                Trade.user_id == user_id,
                Trade.status == "OPEN"
            ).all()
            
            positions = []
            for trade in trades:
                if trade.position_id in chain_positions:
                    position = chain_positions[trade.position_id]
                    positions.append({
                        "trade_id": trade.id,
                        "token": trade.token.symbol,
                        "side": trade.side,
                        "size": trade.size,
                        "entry_price": trade.price,
                        "current_price": position["entry_price"],  # In real impl, get from price feed
                        "leverage": trade.leverage,
                        "pnl": position["pnl"],
                        "liquidation_price": position["liquidation_price"],
                        "timestamp": trade.timestamp
                    })
            
            return positions
            
        except Exception as e:
            logger.error(f"Error getting positions: {str(e)}")
            return []
    
    async def get_user_orders(
        self,
        db: Session,
        user_id: str,
        wallet_address: str
    ) -> List[Dict]:
        """Get all orders for a user"""
        try:
            chain_orders = await mock_chain.get_orders(wallet_address)
            return list(chain_orders.values())
        except Exception as e:
            logger.error(f"Error getting orders: {str(e)}")
            return []
    
    async def get_token_balance(
        self,
        wallet_address: str,
        token_symbol: str
    ) -> float:
        """Get token balance for a wallet"""
        try:
            return await mock_chain.get_balance(wallet_address, token_symbol)
        except Exception as e:
            logger.error(f"Error getting balance: {str(e)}")
            return 0.0

# Global trading service instance
trading_service = TradingService()
