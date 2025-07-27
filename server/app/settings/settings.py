from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    LOG_LEVEL: str = "debug"
    ENVIRONMENT: str = ""
    LANGSMITH_API_KEY: Optional[str] = None
    LANGSMITH_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGSMITH_PROJECT: Optional[str] = None
    LANGSMITH_TRACING: Optional[bool] = None
    CORS_ORIGINS: list[str] = [""]
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
