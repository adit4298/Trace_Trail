"""Anomaly viewer endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..core.dependencies import get_current_user, get_db
from ..models import Anomaly, User
from ..schemas import AnomalyListResponse, AnomalySchema

router = APIRouter()


@router.get("/anomalies", response_model=AnomalyListResponse)
def list_anomalies(
    provider: str | None = Query(default=None),
    risk_level: int | None = Query(default=None, ge=1, le=5),
    limit: int = Query(default=50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnomalyListResponse:
    stmt = select(Anomaly).where(Anomaly.user_id == current_user.id)
    if provider:
        stmt = stmt.where(Anomaly.provider == provider.lower())
    if risk_level:
        stmt = stmt.where(Anomaly.risk_level == risk_level)

    total = db.scalar(select(func.count()).select_from(stmt.subquery()))
    items = (
        db.execute(stmt.order_by(Anomaly.detected_at.desc()).offset(offset).limit(limit))
        .scalars()
        .all()
    )
    return AnomalyListResponse(total=total or 0, items=items)


@router.get("/anomalies/{anomaly_id}", response_model=AnomalySchema)
def get_anomaly(
    anomaly_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnomalySchema:
    anomaly = db.scalar(select(Anomaly).where(Anomaly.id == anomaly_id, Anomaly.user_id == current_user.id))
    if not anomaly:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Anomaly not found")
    return anomaly

