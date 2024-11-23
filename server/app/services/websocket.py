from fastapi import WebSocket
from typing import Dict, List, Optional
import json
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # All active connections
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {
            "price_feed": {},  # Price updates
            "trades": {},      # Trade updates
            "positions": {},   # Position updates
            "risk": {}        # Risk alerts
        }

    async def connect(self, websocket: WebSocket, client_id: str, channel: str):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = {}
        self.active_connections[channel][client_id] = websocket
        logger.info(f"Client {client_id} connected to {channel} channel")

    def disconnect(self, client_id: str, channel: str):
        if channel in self.active_connections and client_id in self.active_connections[channel]:
            del self.active_connections[channel][client_id]
            logger.info(f"Client {client_id} disconnected from {channel} channel")

    async def broadcast_to_channel(self, message: dict, channel: str):
        """Broadcast message to all connections in a channel"""
        if channel not in self.active_connections:
            return
        
        dead_connections = []
        for client_id, connection in self.active_connections[channel].items():
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error sending message to client {client_id}: {str(e)}")
                dead_connections.append(client_id)
        
        # Clean up dead connections
        for client_id in dead_connections:
            self.disconnect(client_id, channel)

    async def send_personal_message(self, message: dict, client_id: str, channel: str):
        """Send a message to a specific client in a channel"""
        if (channel in self.active_connections and 
            client_id in self.active_connections[channel]):
            try:
                await self.active_connections[channel][client_id].send_json(message)
            except Exception as e:
                logger.error(f"Error sending personal message to client {client_id}: {str(e)}")
                self.disconnect(client_id, channel)

class WebSocketManager:
    def __init__(self):
        self.manager = ConnectionManager()

    async def broadcast_price_update(self, token_data: dict):
        """Broadcast price updates to all connected clients"""
        message = {
            "type": "price_update",
            "data": token_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.manager.broadcast_to_channel(message, "price_feed")

    async def broadcast_trade_update(self, trade_data: dict):
        """Broadcast trade updates to all connected clients"""
        message = {
            "type": "trade_update",
            "data": trade_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.manager.broadcast_to_channel(message, "trades")

    async def send_position_update(self, client_id: str, position_data: dict):
        """Send position update to specific client"""
        message = {
            "type": "position_update",
            "data": position_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.manager.send_personal_message(message, client_id, "positions")

    async def send_risk_alert(self, client_id: str, risk_data: dict):
        """Send risk alert to specific client"""
        message = {
            "type": "risk_alert",
            "data": risk_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.manager.send_personal_message(message, client_id, "risk")

# Global WebSocket manager instance
ws_manager = WebSocketManager()
