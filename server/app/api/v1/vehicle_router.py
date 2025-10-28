from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.config.logger_config import setup_logger
from app.services.vehicle_service import VehicleService, get_vehicle_service
from app.model.response.vehicle import VehicleResponse
from app.model.request.vehicle import CreateVehicleRequest, UpdateVehicleRequest
from app.core.errors import ConflictError, ValidationError

vehicle_router = APIRouter()
log = setup_logger("vehicle_router")

@vehicle_router.get("/", response_model=List[VehicleResponse])
async def list_vehicles(
    customer_id: str,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
):
    vehicles = await vehicle_service.list_vehicles(customer_id=customer_id)
    return [VehicleResponse.model_validate(v.model_dump()) for v in vehicles]


@vehicle_router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(
    vehicle_id: str,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
):
    vehicle = await vehicle_service.get_vehicle(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return VehicleResponse.model_validate(vehicle.model_dump())


@vehicle_router.post(
    "/",
    response_model=VehicleResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_vehicle(
    payload: CreateVehicleRequest,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
):
    try:
        vehicle = await vehicle_service.add_vehicle(
            customer_id=payload.customer_id,
            make=payload.make,
            model=payload.model,
            year=payload.year,
            registration=payload.registration,
            mileage=payload.mileage,
            engine_type=payload.engine_type,
            last_service_date=payload.last_service_date,
        )
        return VehicleResponse.model_validate(vehicle.model_dump())
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@vehicle_router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vehicle(
    vehicle_id: str,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
):
    deleted = await vehicle_service.delete_vehicle(vehicle_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@vehicle_router.put("/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(
    vehicle_id: str,
    payload: UpdateVehicleRequest,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
):
    try:
        vehicle = await vehicle_service.update_vehicle(
            vehicle_id=vehicle_id,
            make=payload.make,
            model=payload.model,
            year=payload.year,
            registration=payload.registration,
            mileage=payload.mileage,
            engine_type=payload.engine_type,
            last_service_date=payload.last_service_date,
        )

        if not vehicle:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

        return VehicleResponse.model_validate(vehicle.model_dump())
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))