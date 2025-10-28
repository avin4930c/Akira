from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CreateVehicleRequest(BaseModel):
    customer_id: str = Field(min_length=1)
    make: str = Field(min_length=1)
    model: str = Field(min_length=1)
    year: int = Field(ge=1886)  # first car year
    registration: str = Field(min_length=1)
    mileage: int = Field(ge=0)
    engine_type: str = Field(min_length=1)
    last_service_date: Optional[datetime] = None


class UpdateVehicleRequest(BaseModel):
    make: Optional[str] = Field(default=None, min_length=1)
    model: Optional[str] = Field(default=None, min_length=1)
    year: Optional[int] = Field(default=None, ge=1886)
    registration: Optional[str] = Field(default=None, min_length=1)
    mileage: Optional[int] = Field(default=None, ge=0)
    engine_type: Optional[str] = Field(default=None, min_length=1)
    last_service_date: Optional[datetime] = None