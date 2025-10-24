from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.extension import schemas, service
from src.core.database import get_db
from typing import List

router = APIRouter(prefix="/api/extension", tags=["Extension"])


@router.post("/users", response_model=schemas.ExtensionUserResponse, status_code=status.HTTP_201_CREATED)
async def create_extension_user(
    user_create: schemas.ExtensionUserCreate,
    db: Session = Depends(get_db)
):
    svc = service.ExtensionService(db)
    user = await svc.create_user(user_create)
    return user


@router.post(
    "/users/{extension_user_id}/connections",
    response_model=schemas.ExtensionSocialConnectionResponse,
    status_code=status.HTTP_201_CREATED
)
async def add_social_connection(
    extension_user_id: int,
    connection_data: schemas.ExtensionSocialConnectionCreate,
    db: Session = Depends(get_db)
):
    svc = service.ExtensionService(db)
    conn = await svc.add_connection(extension_user_id, connection_data)
    return conn


@router.get("/users/{extension_user_id}/connections", response_model=List[schemas.ExtensionSocialConnectionResponse])
async def list_social_connections(
    extension_user_id: int,
    db: Session = Depends(get_db)
):
    svc = service.ExtensionService(db)
    connections = await svc.list_connections(extension_user_id)
    return connections
