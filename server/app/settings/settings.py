from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        extra="ignore",
    )

    LOG_LEVEL: str = "debug"
    ENVIRONMENT: str = ""
    DATABASE_URL: str = ""
    LANGSMITH_API_KEY: Optional[str] = None
    LANGSMITH_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGSMITH_PROJECT: Optional[str] = None
    LANGSMITH_TRACING: Optional[bool] = None
    CORS_ORIGINS: list[str] = [""]
    GEMINI_API_KEY: Optional[str] = None
    GCP_PROJECT_ID: Optional[str] = None
    VERTEX_SERVICE_ACCOUNT_JSON_PATH: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    CLERK_JWT_PUBLIC_KEY: Optional[str] = None

    USE_LOCAL_EMBEDDINGS: bool = False
    LOCAL_EMBEDDING_MODEL_NAME: str = "BAAI/bge-large-en-v1.5"
    LOCAL_EMBEDDING_DEVICE: str = "cpu"
    LOCAL_EMBEDDING_DIMENSION: int = 1024
    LOCAL_EMBEDDING_INSTRUCTION: Optional[str] = "Represent this sentence for searching relevant passages: "

    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_MAX_REQUESTS: int = 60
    RATE_LIMIT_WINDOW_SECONDS: int = 60
    RATE_LIMIT_EXEMPT_PATHS: list[str] = []


settings = Settings()
