from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class VehicleResponse(BaseModel):
    id: str
    customer_id: str
    make: str
    model: str
    year: int
    registration: str
    mileage: int # TODO: consider this as context for getting more accurate responses based on wear and tear
    engine_type: str
    last_service_date: Optional[datetime] = None