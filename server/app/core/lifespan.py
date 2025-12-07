from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from app.config.logger_config import setup_logger
from app.settings.settings import settings
from app.core.database import init_db
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
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise
    
    yield
    
    # Cleanup
    logger.info("App is shutting down...")