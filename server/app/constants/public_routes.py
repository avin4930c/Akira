import re

PUBLIC_ROUTES = [
    re.compile(r"^/public/chat/history"),
    re.compile(r"^/health$"),
    re.compile(r"^/$"),
]