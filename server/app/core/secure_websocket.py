import logging
from fastapi import HTTPException, WebSocket, status
from app.utils.auth_utils import auth_util

log = logging.getLogger(__name__)


class SecureWebsocket:
    async def accept(self, websocket: WebSocket) -> tuple[WebSocket, str] | None:
        try:
            # Accept the connection with Bearer authentication protocol
            await websocket.accept(subprotocol="bearer")

            user_id = await self._authenticate_connection(websocket=websocket)
            if not user_id:
                log.error("Closing websocket connection due to missing user_id")
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                return None

            return (websocket, user_id)

        except Exception as e:
            log.error(f"Exception while accepting websocket connection: {e}")
            await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
            return None

    async def _authenticate_connection(self, websocket: WebSocket) -> str | None:
        try:
            auth_header = websocket.headers.get("Sec-WebSocket-Protocol", "")

            if not auth_header:
                log.error("Missing Sec-WebSocket-Protocol header")
                return None

            parts = auth_header.split(",")
            if len(parts) < 2:
                log.error("Malformed Sec-WebSocket-Protocol header: missing session token")
                return None
            
            session_token = parts[1].lstrip()

            if not session_token:
                log.error("Empty session token in protocol header")
                return None

            user_id = auth_util.get_user_id_from_token(session_token)
            return user_id

        except HTTPException as e:
            log.error(f"Authentication failed: {e.detail}")
            return None
        except Exception as e:
            log.error(
                f"Exception while authenticating websocket connection: {e}")
            return None


secure_websocket = SecureWebsocket()
