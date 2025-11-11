from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from app.config.logger_config import setup_logger
from app.settings.settings import settings
from app.core.database import init_db

logger = setup_logger(__name__, log_level=settings.LOG_LEVEL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("App is starting up...")
    logger.info("Initializing database...")
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise
    yield
    logger.info("App is shutting down...")