import asyncio
import json
from datetime import datetime
from typing import AsyncGenerator, Dict, Any
from dataclasses import dataclass

from app.config.logger_config import setup_logger
from app.core.redis_manager import redis_manager

log = setup_logger(__name__)


@dataclass
class SSEEvent:
    event_id: str
    data: Dict[str, Any]
    timestamp: str

    def to_sse_format(self, event_type: str = "update") -> str:
        payload = {
            "event_id": self.event_id,
            "timestamp": self.timestamp,
            **self.data
        }
        return f"event: {event_type}\ndata: {json.dumps(payload)}\n\n"


def _channel_name(event_id: str) -> str:
    """Redis pub/sub channel name for a given event."""
    return f"sse:{event_id}"


class SSEManager:
    """SSE event manager backed by Redis Pub/Sub."""

    async def publish(
        self,
        event_id: str,
        data: Dict[str, Any],
        event_type: str = "update",
    ) -> None:
        event = SSEEvent(
            event_id=event_id,
            data=data,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )
        message = json.dumps({
            "sse_formatted": event.to_sse_format(event_type),
            "event_type": event_type,
        })

        await redis_manager.client.publish(_channel_name(event_id), message)
        log.debug(f"Published SSE event for {event_id}: {event_type}")

    async def subscribe(
        self,
        event_id: str,
        timeout: float = 120.0,
    ) -> AsyncGenerator[str, None]:
        pubsub = redis_manager.client.pubsub()
        channel = _channel_name(event_id)

        await pubsub.subscribe(channel)
        log.debug(f"Subscribed to Redis channel {channel}")

        try:
            yield f"event: connected\ndata: {{\"event_id\": \"{event_id}\"}}\n\n"

            while True:
                try:
                    message = await asyncio.wait_for(
                        pubsub.get_message(ignore_subscribe_messages=True, timeout=timeout),
                        timeout=timeout,
                    )

                    if message is None:
                        yield ": keepalive\n\n"
                        continue

                    payload = json.loads(message["data"])
                    sse_formatted: str = payload["sse_formatted"]
                    event_type: str = payload["event_type"]

                    yield sse_formatted

                    if event_type in ("completed", "error"):
                        yield f"event: close\ndata: {{\"event_id\": \"{event_id}\"}}\n\n"
                        break

                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
                    continue
                except asyncio.CancelledError:
                    log.debug(f"SSE subscription cancelled for {event_id}")
                    break
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.aclose()
            log.debug(f"Unsubscribed from Redis channel {channel}")



sse_manager = SSEManager()


def get_sse_manager() -> SSEManager:
    return sse_manager