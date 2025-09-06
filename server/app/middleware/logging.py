from fastapi import Request

from app.config.logger_config import setup_logger

log = setup_logger("app")


async def logging_middleware(request: Request, call_next):
    log.info(f"Request received: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        log.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        log.error(f"Request failed: {e!s}", exc_info=True)
        raise
