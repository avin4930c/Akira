import logging
from fastapi import FastAPI, Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from app.constants.public_routes import PUBLIC_ROUTES
from app.utils.auth_utils import auth_util
from app.settings.settings import settings

logger = logging.getLogger(__name__)


class ClerkAuthenticationMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app: FastAPI,
    ):
        super().__init__(app)
        self.public_key = settings.CLERK_JWT_PUBLIC_KEY

        logger.info("Clerk Authentication Middleware initialized")

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method

        try:
            if auth_util.is_public_route(path, method, PUBLIC_ROUTES):
                return await call_next(request)

            token = auth_util.extract_bearer_token(request)
            if not token:
                logger.warning(f"Missing token for {method} {path}")
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Authentication token required"},
                )

            try:
                user_id = auth_util.get_user_id_from_token(token)
                request.state.user_id = user_id
            except HTTPException as e:
                logger.error(f"Token verification failed: {str(e.detail)}")
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": str(e.detail)},
                )

        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": "Authentication service error"},
            )

        return await call_next(request)
