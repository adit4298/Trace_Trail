from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .schemas import (
    UserProfileUpdate,
    UserDetailResponse,
    UserPublicProfile,
    UserListResponse
)
from .service import UserService
from src.auth.models import User
from src.core.database import get_db
from src.core.security import get_current_user, get_current_active_superuser
from src.core.dependencies import CommonQueryParams
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserDetailResponse,
    summary="Get current user profile",
    description="Get detailed profile of currently authenticated user",
)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's detailed profile with statistics"""
    service = UserService(db)
    return await service.get_user_profile(current_user.id)


@router.put(
    "/me",
    response_model=UserPublicProfile,
    summary="Update current user profile",
    description="Update profile information for current user",
)
async def update_my_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's profile"""
    service = UserService(db)
    return await service.update_profile(current_user.id, update_data)


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete current user account",
    description="Permanently delete current user account",
)
async def delete_my_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete current user's account"""
    service = UserService(db)
    await service.delete_account(current_user.id)


@router.get(
    "/{user_id}",
    response_model=UserPublicProfile,
    summary="Get user by ID",
    description="Get public profile of a specific user",
)
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
):
    """Get public user profile by ID"""
    service = UserService(db)
    return await service.get_user_profile(user_id)


@router.get(
    "/",
    response_model=UserListResponse,
    summary="List all users",
    description="Get paginated list of all users (admin only)",
)
async def list_users(
    commons: CommonQueryParams = Depends(),
    current_user: User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db),
):
    """List all users (admin only)"""
    service = UserService(db)
    return await service.get_all_users(
        skip=commons.skip,
        limit=commons.limit,
    )
