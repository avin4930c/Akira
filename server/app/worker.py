import asyncio
import json
import signal

from aio_pika.abc import AbstractIncomingMessage
from sqlmodel.ext.asyncio.session import AsyncSession

from app.config.logger_config import setup_logger
from app.settings.settings import settings
from app.core.database import init_db, async_engine
from app.core.rabbitmq import rabbitmq_manager
from app.core.redis_manager import redis_manager
from app.core.sse_manager import SSEManager
from app.services.mia_service import MiaService
from app.workflows.mia_workflow import create_mia_workflow_with_session
from app.utils.langsmith_utils import apply_langsmith_env
from app.constants.mia import (
    MIA_WORKFLOW_QUEUE,
    WORKER_MAX_RETRIES,
    WORKER_RETRY_HEADER,
)

log = setup_logger(__name__)

sse_manager = SSEManager()

_shutdown_event = asyncio.Event()


async def process_message(message: AbstractIncomingMessage) -> None:
    body = json.loads(message.body.decode())
    job_id: str = body["service_job_id"]
    retry_count = int(message.headers.get(WORKER_RETRY_HEADER, 0)) if message.headers else 0

    log.info(f"[Worker] Processing job {job_id} (attempt {retry_count + 1}/{WORKER_MAX_RETRIES})")

    try:
        async with AsyncSession(async_engine) as session:
            workflow = create_mia_workflow_with_session(session)
            service = MiaService(session=session, sse_manager=sse_manager)
            await service.run_workflow(job_id, workflow)

        await message.ack()
        log.info(f"[Worker] Job {job_id} completed successfully")

    except Exception as e:
        log.error(f"[Worker] Job {job_id} failed: {e}", exc_info=True)

        if retry_count + 1 >= WORKER_MAX_RETRIES:
            log.warning(f"[Worker] Job {job_id} exceeded max retries, sending to DLQ")
            await message.reject(requeue=False)
        else:
            await message.reject(requeue=True)


async def run_worker() -> None:
    """Main worker loop: connect to infrastructure and consume messages."""
    log.info("[Worker] Starting MIA workflow worker...")

    apply_langsmith_env(settings)
    await init_db()
    await redis_manager.connect()
    await rabbitmq_manager.connect()

    channel = rabbitmq_manager.channel
    if not channel:
        raise RuntimeError("Failed to acquire RabbitMQ channel")

    await channel.set_qos(prefetch_count=1)

    queue = await channel.get_queue(MIA_WORKFLOW_QUEUE)
    log.info(f"[Worker] Listening on queue '{MIA_WORKFLOW_QUEUE}'...")

    await queue.consume(process_message)

    await _shutdown_event.wait()

    log.info("[Worker] Shutting down...")
    await rabbitmq_manager.disconnect()
    await redis_manager.disconnect()
    await async_engine.dispose()
    log.info("[Worker] Shutdown complete")


def _handle_signal() -> None:
    """Signal handler for graceful shutdown."""
    log.info("[Worker] Received shutdown signal")
    _shutdown_event.set()


def main() -> None:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            loop.add_signal_handler(sig, _handle_signal)
        except NotImplementedError:
            # Windows doesn't support add_signal_handler
            signal.signal(sig, lambda s, f: _handle_signal())

    try:
        loop.run_until_complete(run_worker())
    except KeyboardInterrupt:
        log.info("[Worker] Interrupted by user")
    finally:
        loop.close()


if __name__ == "__main__":
    main()