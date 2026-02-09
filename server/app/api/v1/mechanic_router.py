from typing import List
from fastapi import APIRouter, Depends
from app.services.mechanic_service import MechanicService, get_mechanic_service
from app.model.response.mechanic import MechanicResponse

mechanic_router = APIRouter()


@mechanic_router.get("/", response_model=List[MechanicResponse])
async def get_mechanics(
    mechanic_service: MechanicService = Depends(get_mechanic_service),
):
    mechanics = await mechanic_service.list_mechanics()
    return mechanics