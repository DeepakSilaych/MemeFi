from typing import Dict, Optional
import asyncio
import random
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class MockChainService:
    def __init__(self):
        self.connected_wallets: Dict[str, Dict] = {}
        self.orders: Dict[str, Dict] = {}
        self.positions: Dict[str, Dict] = {}
        self.balances: Dict[str, Dict[str, float]] = {}
        
    async def connect_wallet(self, wallet_address: str) -> Dict:
        """Simulate wallet connection"""
        if wallet_address not in self.connected_wallets:
            self.connected_wallets[wallet_address] = {
                "address": wallet_address,
                "connected_at": datetime.utcnow(),
                "chain_id": "injective-1"
            }
            # Initialize balances for new wallet
            self.balances[wallet_address] = {
                "INJ": 1000.0,
                "USDT": 10000.0,
                "PEPE": 1000000.0,
                "DOGE": 10000.0
            }
        return self.connected_wallets[wallet_address]
    
    async def disconnect_wallet(self, wallet_address: str) -> bool:
        """Simulate wallet disconnection"""
        if wallet_address in self.connected_wallets:
            del self.connected_wallets[wallet_address]
            return True
        return False
    
    async def get_balance(self, wallet_address: str, token: str) -> float:
        """Get token balance for wallet"""
        if wallet_address not in self.balances:
            return 0.0
        return self.balances[wallet_address].get(token, 0.0)
    
    async def place_order(self, wallet_address: str, order_data: Dict) -> Dict:
        """Simulate placing an order on chain"""
        order_id = f"order_{len(self.orders) + 1}"
        order = {
            "id": order_id,
            "wallet_address": wallet_address,
            "token": order_data["token"],
            "side": order_data["side"],
            "size": order_data["size"],
            "price": order_data["price"],
            "leverage": order_data.get("leverage", 1),
            "status": "PENDING",
            "timestamp": datetime.utcnow(),
        }
        
        # Simulate order processing delay
        await asyncio.sleep(1)
        
        # Random success/failure
        if random.random() > 0.1:  # 90% success rate
            order["status"] = "FILLED"
            # Update balances
            token = order_data["token"]
            size = order_data["size"]
            price = order_data["price"]
            cost = size * price
            
            if order_data["side"] == "BUY":
                self.balances[wallet_address]["USDT"] -= cost
                self.balances[wallet_address][token] += size
            else:
                self.balances[wallet_address]["USDT"] += cost
                self.balances[wallet_address][token] -= size
                
            # Create position
            position_id = f"pos_{len(self.positions) + 1}"
            self.positions[position_id] = {
                "id": position_id,
                "wallet_address": wallet_address,
                "token": token,
                "size": size,
                "entry_price": price,
                "leverage": order_data.get("leverage", 1),
                "liquidation_price": price * (0.8 if order_data["side"] == "BUY" else 1.2),
                "pnl": 0,
                "timestamp": datetime.utcnow()
            }
            order["position_id"] = position_id
        else:
            order["status"] = "FAILED"
            order["error"] = "Insufficient liquidity"
            
        self.orders[order_id] = order
        return order
    
    async def close_position(self, wallet_address: str, position_id: str) -> Dict:
        """Simulate closing a position"""
        if position_id not in self.positions:
            raise ValueError("Position not found")
            
        position = self.positions[position_id]
        if position["wallet_address"] != wallet_address:
            raise ValueError("Unauthorized")
            
        # Simulate processing delay
        await asyncio.sleep(1)
        
        # Calculate PnL (random for simulation)
        pnl = random.uniform(-0.1, 0.2) * position["size"] * position["entry_price"]
        
        # Update balances
        self.balances[wallet_address]["USDT"] += position["size"] * position["entry_price"] + pnl
        
        # Mark position as closed
        position["closed_at"] = datetime.utcnow()
        position["final_pnl"] = pnl
        position["status"] = "CLOSED"
        
        return position
    
    async def get_positions(self, wallet_address: str) -> Dict[str, Dict]:
        """Get all positions for a wallet"""
        return {
            pos_id: pos for pos_id, pos in self.positions.items()
            if pos["wallet_address"] == wallet_address and pos.get("status") != "CLOSED"
        }
    
    async def get_orders(self, wallet_address: str) -> Dict[str, Dict]:
        """Get all orders for a wallet"""
        return {
            order_id: order for order_id, order in self.orders.items()
            if order["wallet_address"] == wallet_address
        }
    
    async def update_position_pnl(self, position_id: str, current_price: float) -> Optional[Dict]:
        """Update position PnL based on current price"""
        if position_id not in self.positions:
            return None
            
        position = self.positions[position_id]
        if position.get("status") == "CLOSED":
            return position
            
        entry_price = position["entry_price"]
        size = position["size"]
        leverage = position["leverage"]
        
        # Calculate PnL
        price_diff = current_price - entry_price
        pnl = price_diff * size * leverage
        position["pnl"] = pnl
        
        # Check liquidation
        if current_price <= position["liquidation_price"]:
            position["status"] = "LIQUIDATED"
            position["final_pnl"] = -size * entry_price  # Total loss
            position["closed_at"] = datetime.utcnow()
            
        return position

# Global mock chain service instance
mock_chain = MockChainService()
