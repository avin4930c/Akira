"""TODO: Update to redis based rate limiter for distributed environments"""

import asyncio
import logging
import math
import re
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Iterable, Tuple

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

from app.constants.public_routes import PUBLIC_ROUTES
from app.settings.settings import settings
from app.utils.auth_utils import auth_util

logger = logging.getLogger(__name__)


class InMemoryRateLimiter:
	"""Sliding-window rate limiter stored in process memory."""

	def __init__(self, max_requests: int, window_seconds: int):
		self.max_requests = max_requests
		self.window_seconds = window_seconds
		self._hits: Dict[str, Deque[float]] = defaultdict(deque)
		self._lock = asyncio.Lock()

	async def hit(self, key: str) -> Tuple[bool, int, int]:
		"""Record a hit and return (allowed, remaining, retry_after_sec)."""

		now = time.monotonic()
		window_start = now - self.window_seconds

		async with self._lock:
			bucket = self._hits[key]

			# Drop timestamps outside the current window.
			while bucket and bucket[0] < window_start:
				bucket.popleft()

			if len(bucket) >= self.max_requests:
				retry_after = math.ceil((bucket[0] + self.window_seconds) - now)
				return False, 0, max(retry_after, 0)

			bucket.append(now)
			remaining = self.max_requests - len(bucket)
			return True, remaining, 0


def _client_identifier(request: Request) -> str:
	"""Prefer authenticated user id, otherwise fall back to client IP."""

	if hasattr(request.state, "user_id") and request.state.user_id:
		return f"user:{request.state.user_id}"

	forwarded = request.headers.get("X-Forwarded-For")
	if forwarded:
		ip = forwarded.split(",")[0].strip()
		return f"ip:{ip}"

	client_host = request.client.host if request.client else "unknown"
	return f"ip:{client_host}"


class RateLimiterMiddleware(BaseHTTPMiddleware):
	"""ASGI middleware that enforces request limits per client key."""

	def __init__(
		self,
		app,
		limiter: InMemoryRateLimiter,
		exempt_routes: Iterable = (),
	):
		super().__init__(app)
		self.limiter = limiter
		self.exempt_routes = list(exempt_routes)

	async def dispatch(self, request: Request, call_next):
		if not settings.RATE_LIMIT_ENABLED:
			return await call_next(request)

		path = request.url.path
		method = request.method

		if auth_util.is_public_route(path, method, self.exempt_routes):
			return await call_next(request)

		client_key = _client_identifier(request)
		allowed, remaining, retry_after = await self.limiter.hit(client_key)

		if not allowed:
			logger.warning("Rate limit exceeded", extra={"client_key": client_key, "path": path})
			return JSONResponse(
				status_code=HTTP_429_TOO_MANY_REQUESTS,
				content={"detail": "Too many requests"},
				headers={
					"Retry-After": str(retry_after),
					"X-RateLimit-Limit": str(self.limiter.max_requests),
					"X-RateLimit-Remaining": "0",
					"X-RateLimit-Window": str(self.limiter.window_seconds),
				},
			)

		response = await call_next(request)
		response.headers["X-RateLimit-Limit"] = str(self.limiter.max_requests)
		response.headers["X-RateLimit-Remaining"] = str(remaining)
		response.headers["X-RateLimit-Window"] = str(self.limiter.window_seconds)
		return response


limiter = InMemoryRateLimiter(
	max_requests=settings.RATE_LIMIT_MAX_REQUESTS,
	window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS,
)

# Use existing public routes plus any custom exempt paths from settings.
EXEMPT_PATTERNS = list(PUBLIC_ROUTES)
for raw in settings.RATE_LIMIT_EXEMPT_PATHS:
	try:
		EXEMPT_PATTERNS.append(re.compile(raw))
	except Exception:
		logger.warning("Invalid RATE_LIMIT_EXEMPT_PATHS pattern skipped", extra={"pattern": raw})