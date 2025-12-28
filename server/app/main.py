from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.settings.settings import settings
from app.core.lifespan import lifespan
from app.middleware.logging import logging_middleware
from app.middleware.rate_limiter import EXEMPT_PATTERNS, RateLimiterMiddleware, limiter
from app.api.v1.chat_router import chat_router
from app.api.v1.customer_router import customer_router
from app.api.v1.vehicle_router import vehicle_router
from app.api.v1.rag_router import rag_router
from app.api.v1.mia_router import mia_router
from app.middleware.clerk_auth_middleware import ClerkAuthenticationMiddleware

app = FastAPI(lifespan=lifespan)

app.add_middleware(ClerkAuthenticationMiddleware)
app.add_middleware(RateLimiterMiddleware, limiter=limiter, exempt_routes=EXEMPT_PATTERNS)

app.middleware("http")(logging_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Allows the frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(customer_router, prefix="/customer", tags=["customer"])
app.include_router(vehicle_router, prefix="/vehicle", tags=["vehicle"])
app.include_router(rag_router, prefix="/rag", tags=["rag"])
app.include_router(mia_router, prefix="/mia", tags=["mia"])


@app.get("/")
async def root():
    return {"Backend": "Akira backend in " + settings.ENVIRONMENT}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}