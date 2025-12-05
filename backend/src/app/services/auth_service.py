"""Authentication services for signup/login/token lifecycle."""

from __future__ import annotations

import datetime as dt
import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..core.config import Settings
from ..core.jwt import create_access_token
from ..core.security import generate_refresh_token, get_password_hash, hash_refresh_token, verify_password
from ..models import RefreshToken, User
from ..schemas import LoginRequest, SignupRequest, TokenResponse
from .activity_service import record_activity


class AuthService:
    """Business logic for user authentication."""

    def __init__(self, db: Session, settings: Settings):
        self.db = db
        self.settings = settings

    def signup(self, data: SignupRequest) -> User:
        if self.db.scalar(select(User).where(User.email == data.email)):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user = User(email=data.email.lower(), password_hash=get_password_hash(data.password), name=data.name)
        self.db.add(user)
        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Unable to create user") from exc
        self.db.refresh(user)

        record_activity(
            self.db,
            action_type="signup",
            message="User registered via email/password",
            user_id=user.id,
            metadata={"email": user.email},
        )
        self.db.commit()
        return user

    def login(self, data: LoginRequest, *, user_agent: str | None, ip_address: str | None) -> TokenResponse:
        user = self.db.scalar(select(User).where(User.email == data.email.lower()))
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        user.last_login_at = dt.datetime.now(dt.timezone.utc)
        tokens = self._issue_tokens(user=user, user_agent=user_agent, ip_address=ip_address)
        record_activity(
            self.db,
            action_type="login",
            message="User logged in",
            user_id=user.id,
            metadata={"ip": ip_address},
        )
        self.db.commit()
        return tokens

    def logout(self, refresh_token: str) -> None:
        hashed = hash_refresh_token(refresh_token)
        token = self.db.scalar(select(RefreshToken).where(RefreshToken.hashed_token == hashed, RefreshToken.revoked.is_(False)))
        if token:
            token.revoked = True
            self.db.add(token)
            record_activity(
                self.db,
                action_type="logout",
                message="User logged out",
                user_id=token.user_id,
            )
            self.db.commit()

    def refresh(self, refresh_token: str) -> TokenResponse:
        hashed = hash_refresh_token(refresh_token)
        token = self.db.scalar(
            select(RefreshToken).where(
                RefreshToken.hashed_token == hashed,
                RefreshToken.revoked.is_(False),
            RefreshToken.expires_at > dt.datetime.now(dt.timezone.utc),
            )
        )
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        user = self.db.get(User, token.user_id)
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User inactive")

        token.revoked = True
        self.db.add(token)
        self.db.flush()

        response = self._issue_tokens(user=user, user_agent=token.user_agent, ip_address=token.ip_address)
        self.db.commit()
        return response

    def _issue_tokens(self, *, user: User, user_agent: str | None, ip_address: str | None) -> TokenResponse:
        access_token = create_access_token(str(user.id))
        refresh_plain = generate_refresh_token()
        refresh_entity = RefreshToken(
            user_id=user.id,
            hashed_token=hash_refresh_token(refresh_plain),
            expires_at=dt.datetime.now(dt.timezone.utc) + dt.timedelta(days=self.settings.REFRESH_TOKEN_EXPIRE_DAYS),
            user_agent=user_agent,
            ip_address=ip_address,
        )
        self.db.add(refresh_entity)
        self.db.flush()

        return TokenResponse(access_token=access_token, refresh_token=refresh_plain)

