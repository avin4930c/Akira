from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.chat import chat
from src.settings import settings

app = FastAPI()

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
    return {"Backend": "Bike Chatbot Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True) 