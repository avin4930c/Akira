from fastapi import Depends
from app.core.database import get_session
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from app.model.sql_models.mia import Mechanic


class MechanicService:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def list_mechanics(self) -> List[Mechanic]:
        statement = select(Mechanic)
        result = await self.session.exec(statement)
        return list(result.all())


async def get_mechanic_service(session: AsyncSession = Depends(get_session)) -> MechanicService:
    return MechanicService(session)