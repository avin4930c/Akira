import asyncio
from app.config.logger_config import setup_logger
from typing import Dict
from fastapi import WebSocket
from app.core.secure_websocket import secure_websocket

log = setup_logger(__name__)


class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> str | None:
        result = await secure_websocket.accept(websocket)
        if result:
            websocket, user_id = result
            self.active_connections[user_id] = websocket
            log.info(
                f"User {user_id} connected. Total connections: {len(self.active_connections)}"
            )
            return user_id
        return None

    async def connect_unsecure(self, websocket: WebSocket, anon_user_id: str):
        await websocket.accept()
        self.active_connections[anon_user_id] = websocket
        log.info(f"Anonymous user {anon_user_id} connected")

    async def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.close()
            del self.active_connections[user_id]
            log.info(
                f"User {user_id} disconnected. Total connections: {len(self.active_connections)}"
            )

    async def send_message(self, user_id: str, message: str):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            try:
                log.info(f"Sending message to {user_id}: {message}")
                await websocket.send_text(message)
            except Exception as e:
                log.error(f"Failed to send message to {user_id}: {e}")
                await self.disconnect(user_id)
                raise e

    def is_connected(self, user_id: str) -> bool:
        return user_id in self.active_connections


webSocketConnectionManager = WebSocketConnectionManager()