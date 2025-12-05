"""Signal browsing endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..core.dependencies import get_current_user, get_db
from ..models import Signal, User
from ..schemas import SignalListResponse, SignalSchema

router = APIRouter()


@router.get("/signals", response_model=SignalListResponse)
def list_signals(
    provider: str | None = Query(default=None),
    severity: int | None = Query(default=None, ge=1, le=5),
    category: str | None = Query(default=None),
    limit: int = Query(default=50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SignalListResponse:
    stmt = select(Signal).where(Signal.user_id == current_user.id)
    if provider:
        stmt = stmt.where(Signal.provider == provider.lower())
    if severity:
        stmt = stmt.where(Signal.severity == severity)
    if category:
        stmt = stmt.where(Signal.category == category)

    total = db.scalar(select(func.count()).select_from(stmt.subquery()))
    items = (
        db.execute(stmt.order_by(Signal.created_at.desc()).offset(offset).limit(limit))
        .scalars()
        .all()
    )
    return SignalListResponse(total=total or 0, items=items)


@router.get("/signals/{signal_id}", response_model=SignalSchema)
def get_signal(
    signal_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SignalSchema:
    signal = db.scalar(select(Signal).where(Signal.id == signal_id, Signal.user_id == current_user.id))
    if not signal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Signal not found")
    return signal

