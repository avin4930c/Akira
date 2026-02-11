from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from app.config.logger_config import setup_logger
from app.settings.settings import settings
from app.core.database import init_db, async_engine
from app.core.rabbitmq import rabbitmq_manager
from app.core.redis_manager import redis_manager
from app.utils.langsmith_utils import apply_langsmith_env

logger = setup_logger(__name__, log_level=settings.LOG_LEVEL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("App is starting up...")
    
    # Initialize LangSmith
    apply_langsmith_env(settings)
    
    # Initialize database
    logger.info("Initializing database...")
    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise
    
    try:
        await redis_manager.connect()
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")
        raise

    try:
        await rabbitmq_manager.connect()
    except Exception as e:
        logger.error(f"Failed to connect to RabbitMQ: {e}")
        raise
    
    yield
    
    # Cleanup
    logger.info("App is shutting down...")
    try:
        await rabbitmq_manager.disconnect()
    except Exception as e:
        logger.error(f"Error disconnecting RabbitMQ: {e}")
    
    try:
        await redis_manager.disconnect()
    except Exception as e:
        logger.error(f"Error disconnecting Redis: {e}")
    
    try:
        await async_engine.dispose()
        logger.info("Database engine disposed")
    except Exception as e:
        logger.error(f"Error disposing database engine: {e}")