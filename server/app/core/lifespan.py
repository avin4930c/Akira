from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from app.config.logger_config import setup_logger
from app.settings.settings import settings

logger = setup_logger(__name__, log_level=settings.LOG_LEVEL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("App is starting up...")
    yield
    logger.info("App is shutting down...")