import os
from app.config.logger_config import setup_logger

log = setup_logger(__name__)


def apply_langsmith_env(settings):
    if not settings.LANGSMITH_TRACING:
        log.info("Langsmith tracing is disabled.")
        return

    if settings.LANGSMITH_API_KEY:
        os.environ["LANGCHAIN_API_KEY"] = settings.LANGSMITH_API_KEY
    if settings.LANGSMITH_TRACING:
        os.environ["LANGCHAIN_TRACING"] = "true"
    if settings.LANGSMITH_PROJECT:
        os.environ["LANGCHAIN_PROJECT"] = settings.LANGSMITH_PROJECT

    log.info("Langsmith tracing is enabled.")
