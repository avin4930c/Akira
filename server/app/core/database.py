from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError
from app.settings.settings import settings
from app.config.logger_config import setup_logger

logger = setup_logger(__name__)


def _get_async_database_url() -> str:
    """Convert sync database URL to async (postgresql+asyncpg://)"""
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        return db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif db_url.startswith("postgres://"):
        return db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    return db_url


async_engine: AsyncEngine = create_async_engine(
    _get_async_database_url(),
    echo=True,
    pool_timeout=20,
    pool_recycle=3600,
)


async def init_db() -> None:
    try:
        logger.info(f"Creating database tables with name: {settings.DATABASE_URL.split('/')[-1]}")

        try:
            async with async_engine.begin() as conn:
                await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
                logger.info("PGVector extension enabled")
        except ProgrammingError as e:
            if "already exists" in str(e).lower() or "extension" in str(e).lower():
                logger.info("PGVector extension already exists or was created by another instance")
            else:
                raise

        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        raise


async def get_session():
    async with AsyncSession(async_engine) as session:
        yield session