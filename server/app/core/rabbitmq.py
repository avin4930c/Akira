import json
from typing import Any

import aio_pika
from aio_pika import DeliveryMode, Message
from aio_pika.abc import AbstractRobustConnection, AbstractChannel

from app.config.logger_config import setup_logger
from app.settings.settings import settings
from app.constants.mia import (
    MIA_WORKFLOW_QUEUE,
    MIA_DEAD_LETTER_EXCHANGE,
    MIA_DEAD_LETTER_QUEUE,
)

log = setup_logger(__name__)


class RabbitMQManager:
    def __init__(self):
        self._connection: AbstractRobustConnection | None = None
        self._channel: AbstractChannel | None = None

    async def connect(self) -> None:
        log.info(f"Connecting to RabbitMQ at {settings.RABBITMQ_HOST}:{settings.RABBITMQ_PORT}...")
        self._connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
        self._channel = await self._connection.channel()

        dlx = await self._channel.declare_exchange(
            MIA_DEAD_LETTER_EXCHANGE,
            aio_pika.ExchangeType.DIRECT,
            durable=True,
        )
        dlq = await self._channel.declare_queue(MIA_DEAD_LETTER_QUEUE, durable=True)
        await dlq.bind(dlx, routing_key=MIA_WORKFLOW_QUEUE)

        await self._channel.declare_queue(
            MIA_WORKFLOW_QUEUE,
            durable=True,
            arguments={
                "x-dead-letter-exchange": MIA_DEAD_LETTER_EXCHANGE,
                "x-dead-letter-routing-key": MIA_WORKFLOW_QUEUE,
            },
        )

        log.info("RabbitMQ connected and queues declared")

    async def disconnect(self) -> None:
        if self._connection and not self._connection.is_closed:
            await self._connection.close()
            log.info("RabbitMQ connection closed")

    async def publish(self, queue_name: str, body: dict[str, Any], headers: dict[str, str] | None = None) -> None:
        if not self._channel:
            raise RuntimeError("RabbitMQ channel is not initialized. Call connect() first.")

        message = Message(
            body=json.dumps(body).encode(),
            delivery_mode=DeliveryMode.PERSISTENT,
            content_type="application/json",
            headers=headers,
        )

        await self._channel.default_exchange.publish(
            message,
            routing_key=queue_name,
        )
        log.info(f"Published message to '{queue_name}': {body}")

    @property
    def channel(self) -> AbstractChannel | None:
        return self._channel

    @property
    def connection(self) -> AbstractRobustConnection | None:
        return self._connection


rabbitmq_manager = RabbitMQManager()


def get_rabbitmq_manager() -> RabbitMQManager:
    return rabbitmq_manager