from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.services.websocket import ws_manager
import logging
from uuid import uuid4

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/ws/price-feed")
async def price_feed_websocket(websocket: WebSocket):
    client_id = str(uuid4())
    await ws_manager.manager.connect(websocket, client_id, "price_feed")
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.manager.disconnect(client_id, "price_feed")

@router.websocket("/ws/trades/{user_id}")
async def trades_websocket(websocket: WebSocket, user_id: str):
    client_id = str(user_id)
    await ws_manager.manager.connect(websocket, client_id, "trades")
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.manager.disconnect(client_id, "trades")

@router.websocket("/ws/positions/{user_id}")
async def positions_websocket(websocket: WebSocket, user_id: str):
    client_id = str(user_id)
    await ws_manager.manager.connect(websocket, client_id, "positions")
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.manager.disconnect(client_id, "positions")

@router.websocket("/ws/risk/{user_id}")
async def risk_websocket(websocket: WebSocket, user_id: str):
    client_id = str(user_id)
    await ws_manager.manager.connect(websocket, client_id, "risk")
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.manager.disconnect(client_id, "risk")
