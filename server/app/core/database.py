from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError
from app.settings.settings import settings
from app.config.logger_config import setup_logger

logger = setup_logger(__name__)

engine = create_engine(
    settings.DATABASE_URL, 
    echo=True,
    connect_args={"connect_timeout": 10},
    pool_timeout=20,
    pool_recycle=3600
)

def init_db() -> None:
    try:
        logger.info(f"Creating database tables with name: {settings.DATABASE_URL.split('/')[-1]}")
        
        try:
            with engine.connect() as conn:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
                conn.commit()
                logger.info("PGVector extension enabled")
        except ProgrammingError as e:
            if "already exists" in str(e).lower() or "extension" in str(e).lower():
                logger.info("PGVector extension already exists or was created by another instance")
            else:
                raise
        
        SQLModel.metadata.create_all(engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        raise

def get_session():
    with Session(engine) as session:
        yield session