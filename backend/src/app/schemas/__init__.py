"""Pydantic schemas for API requests and responses."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, EmailStr, Field

from ..core.constants import SUPPORTED_PROVIDERS


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class AccountDetails(BaseModel):
    provider: str = Field(pattern="|".join(SUPPORTED_PROVIDERS))
    connected: bool
    status: str
    username: Optional[str] = None
    email: Optional[str] = None
    last_synced_at: Optional[datetime] = None


class AccountsResponse(BaseModel):
    accounts: List[AccountDetails]


class SignalSchema(BaseModel):
    id: uuid.UUID
    provider: str
    category: str
    title: str
    description: Optional[str]
    severity: int
    metadata: dict | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class SignalListResponse(BaseModel):
    total: int
    items: List[SignalSchema]


class AnomalySchema(BaseModel):
    id: uuid.UUID
    provider: str
    anomaly_type: str
    confidence_score: float
    risk_level: int
    details: dict | None = None
    detected_at: datetime

    class Config:
        from_attributes = True


class AnomalyListResponse(BaseModel):
    total: int
    items: List[AnomalySchema]


class InsightSchema(BaseModel):
    id: uuid.UUID
    content: str
    metadata: dict | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class SystemHealthSchema(BaseModel):
    score: int
    components: dict | None = None
    updated_at: datetime

    class Config:
        from_attributes = True


class HealthStatusResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    environment: str


class SyncResponse(BaseModel):
    provider: str
    status: str
    synced_signals: int
    detected_anomalies: int


class OAuthRedirectResponse(BaseModel):
    authorization_url: str


class ApiMessage(BaseModel):
    message: str
    data: Any | None = None

