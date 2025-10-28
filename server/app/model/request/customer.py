from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class CreateCustomerRequest(BaseModel):
    name: str = Field(min_length=1)
    phone: str = Field(min_length=5)
    email: EmailStr
    id: str


class UpdateCustomerRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    phone: Optional[str] = Field(default=None, min_length=5)
    email: Optional[EmailStr] = None
    vehicle_count: Optional[int] = None
    
class SearchCustomerRequest(BaseModel):
    query: str = Field(min_length=1)