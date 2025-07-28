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
    LANGSMITH_API_KEY: Optional[str] = None
    LANGSMITH_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGSMITH_PROJECT: Optional[str] = None
    LANGSMITH_TRACING: Optional[bool] = None
    CORS_ORIGINS: list[str] = [""]
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

settings = Settings()
