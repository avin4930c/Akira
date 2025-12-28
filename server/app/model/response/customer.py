from pydantic import BaseModel
from datetime import datetime

class CustomerResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    vehicle_count: int
    created_at: datetime