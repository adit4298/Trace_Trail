"""Authentication endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from ..core.dependencies import get_auth_service, get_current_user
from ..models import User
from ..schemas import ApiMessage, LoginRequest, RefreshTokenRequest, SignupRequest, TokenResponse
from ..services.auth_service import AuthService

router = APIRouter()


@router.post("/signup", response_model=ApiMessage, status_code=201)
def signup(data: SignupRequest, service: AuthService = Depends(get_auth_service)) -> ApiMessage:
    service.signup(data)
    return ApiMessage(message="Account created")


@router.post("/login", response_model=TokenResponse)
def login(
    data: LoginRequest,
    request: Request,
    service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    user_agent = request.headers.get("user-agent")
    ip_address = request.client.host if request.client else None
    return service.login(data, user_agent=user_agent, ip_address=ip_address)


@router.post("/logout", response_model=ApiMessage)
def logout(
    payload: RefreshTokenRequest,
    service: AuthService = Depends(get_auth_service),
    current_user: User = Depends(get_current_user),  # noqa: ARG001
) -> ApiMessage:
    service.logout(payload.refresh_token)
    return ApiMessage(message="Logged out")


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: RefreshTokenRequest, service: AuthService = Depends(get_auth_service)) -> TokenResponse:
    return service.refresh(payload.refresh_token)

