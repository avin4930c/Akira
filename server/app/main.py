from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.settings.settings import settings
from app.core.lifespan import lifespan
from app.middleware.logging import logging_middleware
from app.api.v1.chat_router import chat_router
from app.middleware.clerk_auth_middleware import ClerkAuthenticationMiddleware

app = FastAPI(lifespan=lifespan)

app.add_middleware(ClerkAuthenticationMiddleware)

app.middleware("http")(logging_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Allows the frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(chat_router, prefix="/chat")

@app.get("/")
async def root():
    return {"Backend": "Akira backend in " + settings.ENVIRONMENT}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}