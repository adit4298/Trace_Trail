from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from .schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    PasswordChange,
    RefreshTokenRequest
)
from .service import AuthService
from .models import User
from src.core.database import get_db
from src.core.security import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account and receive authentication tokens"
)
async def signup(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    
    - **email**: Valid email address (must be unique)
    - **username**: Username (3-50 characters, alphanumeric, _, -)
    - **password**: Strong password (min 8 characters, must contain uppercase, lowercase, digit)
    - **full_name**: Optional full name
    
    Returns access_token and refresh_token for immediate authentication.
    """
    service = AuthService(db)
    return await service.register_user(user_data)

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login user",
    description="Authenticate user with email and password"
)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login user and receive authentication tokens.
    
    - **email**: Registered email address
    - **password**: User password
    
    Returns access_token and refresh_token.
    """
    service = AuthService(db)
    return await service.login_user(login_data)

@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token",
    description="Get new access token using refresh token"
)
async def refresh_token(
    token_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using a valid refresh token.
    
    - **refresh_token**: Valid refresh token received from login or signup
    
    Returns new access_token and refresh_token.
    """
    service = AuthService(db)
    return await service.refresh_access_token(token_data.refresh_token)

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    description="Get currently authenticated user information"
)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's profile information.
    
    Requires valid access token in Authorization header:
    Authorization: Bearer <access_token>
    """
    return current_user

@router.post(
    "/change-password",
    summary="Change password",
    description="Change current user's password"
)
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change password for currently authenticated user.
    
    - **old_password**: Current password
    - **new_password**: New password (must meet strength requirements)
    
    Requires valid access token in Authorization header.
    """
    service = AuthService(db)
    return await service.change_password(current_user.id, password_data)

@router.post(
    "/logout",
    summary="Logout user",
    description="Logout current user (client-side token invalidation)"
)
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout user.
    
    Note: This is primarily for client-side token removal.
    In production, implement token blacklisting with Redis.
    """
    logger.info(f"User logged out: {current_user.email}")
    return {"message": "Logged out successfully"}
