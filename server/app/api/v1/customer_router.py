from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.config.logger_config import setup_logger
from app.services.customer_service import CustomerService, get_customer_service
from app.model.response.customer import CustomerResponse
from app.model.request.customer import SearchCustomerRequest
from app.model.request.customer import CreateCustomerRequest, UpdateCustomerRequest
from app.core.errors import ConflictError, ValidationError

customer_router = APIRouter()
log = setup_logger("customer_router")

@customer_router.get("/", response_model=List[CustomerResponse])
async def list_customers(
    customer_service: CustomerService = Depends(get_customer_service),
):
    customers = await customer_service.list_customers()
    return [CustomerResponse.model_validate(c.model_dump()) for c in customers]


@customer_router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: str,
    customer_service: CustomerService = Depends(get_customer_service),
):
    customer = await customer_service.get_customer(customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return CustomerResponse.model_validate(customer.model_dump())


@customer_router.post(
    "/",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_customer(
    payload: CreateCustomerRequest,
    customer_service: CustomerService = Depends(get_customer_service),
):
    try:
        customer = await customer_service.add_customer(
            name=payload.name,
            phone=payload.phone,
            email=payload.email,
            id=payload.id,
        )
        return CustomerResponse.model_validate(customer.model_dump())
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@customer_router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: str,
    payload: UpdateCustomerRequest,
    customer_service: CustomerService = Depends(get_customer_service),
):
    try:
        customer = await customer_service.update_customer(
            customer_id,
            name=payload.name,
            phone=payload.phone,
            email=payload.email,
            vehicle_count=payload.vehicle_count,
        )
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        return CustomerResponse.model_validate(customer.model_dump())
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@customer_router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(
    customer_id: str,
    customer_service: CustomerService = Depends(get_customer_service),
):
    customer = await customer_service.get_customer(customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    await customer_service.delete_customer_cascade(customer_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@customer_router.post("/search", response_model=List[CustomerResponse])
async def search_customer(
    payload: SearchCustomerRequest,
    customer_service: CustomerService = Depends(get_customer_service),
):
    q = payload.query
    if not q:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="query is required")

    matches = await customer_service.search_customers(q)
    return [CustomerResponse.model_validate(c.model_dump()) for c in matches]