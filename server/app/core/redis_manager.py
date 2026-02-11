import redis.asyncio as aioredis

from app.config.logger_config import setup_logger
from app.settings.settings import settings

log = setup_logger(__name__)


class RedisManager:
    """Manages a shared async Redis connection pool."""

    def __init__(self):
        self._client: aioredis.Redis | None = None

    async def connect(self) -> None:
        log.info(f"Connecting to Redis at {settings.REDIS_HOST}:{settings.REDIS_PORT}...")
        self._client = aioredis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
        )
        await self._client.ping()
        log.info("Redis connected")

    async def disconnect(self) -> None:
        if self._client:
            await self._client.aclose()
            log.info("Redis connection closed")

    @property
    def client(self) -> aioredis.Redis:
        if not self._client:
            raise RuntimeError("Redis client is not initialized. Call connect() first.")
        return self._client


redis_manager = RedisManager()


def get_redis_manager() -> RedisManager:
    return redis_manager