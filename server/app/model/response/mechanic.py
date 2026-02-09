from pydantic import BaseModel


class MechanicResponse(BaseModel):
    id: str
    name: str
    mechanic_code: str