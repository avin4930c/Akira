import re
from app.settings.settings import settings

PUBLIC_ROUTES = [
    re.compile(r"^/public/chat/history"),
    re.compile(r"^/health$"),
    re.compile(r"^/$"),
]

if settings.ENVIRONMENT == "development":
    PUBLIC_ROUTES.extend([
        re.compile(r"^/docs$"),
        re.compile(r"^/openapi.json$"),
    ])