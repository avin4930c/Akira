import asyncio
import json
from datetime import datetime
from typing import AsyncGenerator, Dict, Optional, Any
from dataclasses import dataclass, asdict

from app.config.logger_config import setup_logger

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


class SSEManager:
    def __init__(self, queue_maxsize: int = 100):
        self._queues: Dict[str, asyncio.Queue] = {}
        self._queue_maxsize = queue_maxsize
        self._lock = asyncio.Lock()

    async def _get_or_create_queue(self, event_id: str) -> asyncio.Queue:
        async with self._lock:
            if event_id not in self._queues:
                self._queues[event_id] = asyncio.Queue(maxsize=self._queue_maxsize)
                log.debug(f"Created SSE queue for {event_id}")
            return self._queues[event_id]

    async def publish(
        self,
        event_id: str,
        data: Dict[str, Any],
        event_type: str = "update",
    ) -> None:
        queue = await self._get_or_create_queue(event_id)
        
        event = SSEEvent(
            event_id=event_id,
            data=data,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )
        
        try:
            queue.put_nowait(event.to_sse_format(event_type))
            log.debug(f"Published SSE event for {event_id}: {event_type}")
        except asyncio.QueueFull:
            log.warning(f"SSE queue full for {event_id}, dropping oldest event")
            try:
                queue.get_nowait()
                queue.put_nowait(event.to_sse_format(event_type))
            except asyncio.QueueEmpty:
                pass

    async def subscribe(
        self,
        event_id: str,
        timeout: float = 120.0,
    ) -> AsyncGenerator[str, None]:
        queue = await self._get_or_create_queue(event_id)
        
        yield f"event: connected\ndata: {{\"event_id\": \"{event_id}\"}}\n\n"
        
        while True:
            try:
                event_data = await asyncio.wait_for(queue.get(), timeout=timeout)
                yield event_data
                
                if event_data.startswith("event: completed") or event_data.startswith("event: error"):
                    yield f"event: close\ndata: {{\"event_id\": \"{event_id}\"}}\n\n"
                    break
                    
            except asyncio.TimeoutError:
                yield ": keepalive\n\n"
                continue
            except asyncio.CancelledError:
                log.debug(f"SSE subscription cancelled for {event_id}")
                break

    async def unsubscribe(self, event_id: str) -> None:
        async with self._lock:
            if event_id in self._queues:
                del self._queues[event_id]
                log.debug(f"Removed SSE queue for {event_id}")

    def is_subscribed(self, event_id: str) -> bool:
        return event_id in self._queues


sse_manager = SSEManager()


def get_sse_manager() -> SSEManager:
    return sse_manager