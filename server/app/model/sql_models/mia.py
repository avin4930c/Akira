from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB
from typing import List
from typing import Optional
from datetime import datetime
from uuid import uuid4
from app.constants.enums.mia_enums import ServiceJobStatus


class Customer(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str
    phone: str
    email: str
    vehicle_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Vehicle(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    customer_id: str = Field(foreign_key="customer.id", index=True)
    make: str
    model: str
    year: int
    registration: str
    mileage: int
    engine_type: str
    last_service_date: Optional[datetime] = None


class Mechanic(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str
    mechanic_code: str


class PartAvailabilityStatus(str, Enum):
    available = "available"
    unavailable = "unavailable"
    partial = "partial"

class ServiceJob(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    customer_id: str = Field(foreign_key="customer.id", index=True)
    vehicle_id: str = Field(foreign_key="vehicle.id", index=True)
    mechanic_id: str = Field(foreign_key="mechanic.id", index=True)
    status: ServiceJobStatus = Field(default=ServiceJobStatus.pending)
    notes: str
    validated_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class PartInventory(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    part_code: str = Field(index=True, unique=True)
    name: str
    description: Optional[str] = None
    stock_quantity: int = Field(default=0, ge=0)
    unit_price: float = Field(ge=0)
    compatible_models: List[str] = Field(default_factory=list, sa_type=JSONB)
    
class ServicePart(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    job_id: str = Field(foreign_key="servicejob.id")
    inventory_part_id: Optional[str] = Field(foreign_key="partinventory.id")
    name: str
    quantity: int = Field(default=1, ge=1)
    unit_price: float = Field(ge=0)
    availability_status: PartAvailabilityStatus = Field(default=PartAvailabilityStatus.available)