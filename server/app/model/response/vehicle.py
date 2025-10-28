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
    mileage: int
    engine_type: str
    last_service_date: Optional[datetime] = None