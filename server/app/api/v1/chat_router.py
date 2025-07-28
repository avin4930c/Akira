from fastapi import WebSocket, APIRouter
from app.services.chat_service import ChatManager

chat_router = APIRouter()
@chat_router.websocket("/ws")
async def chat_websocket(websocket: WebSocket):
    await websocket.accept()
    chat_manager =  ChatManager()

    while True:
        user_query = await websocket.receive_text()
        
        response = await chat_manager.process_message(user_query)
            
        await websocket.send_text(response)