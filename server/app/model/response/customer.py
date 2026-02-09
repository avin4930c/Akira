from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CustomerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    name: str
    phone: str
    email: str
    vehicle_count: int
    created_at: datetime