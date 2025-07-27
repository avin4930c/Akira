from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import chat
from app.settings.settings import settings
from server.app.core.lifespan import lifespan
from app.middleware.logging import logging_middleware

app = FastAPI(lifespan=lifespan)

app.add_middleware("http")(logging_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Allows the frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(chat.chat_router, prefix="/chat")

@app.get("/")
async def root():
    return {"Backend": "Akira backend in " + settings.ENVIRONMENT}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 