from fastapi import WebSocket, APIRouter, Depends
from app.services.chat_service import get_chat_service, ChatService

chat_router = APIRouter()


@chat_router.websocket("/ws")
async def chat_websocket(websocket: WebSocket, chat_service: ChatService = Depends(get_chat_service)):
    await websocket.accept()

    try:
        while True:
            user_query = await websocket.receive_text()

            response = await chat_service.process_message(user_query)
            await websocket.send_text(response)

    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()
