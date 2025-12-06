"""Helpers for writing activity logs."""

from __future__ import annotations

import uuid
from typing import Any, Dict

from sqlalchemy.orm import Session

from ..models import ActivityLog


def record_activity(
    db: Session,
    *,
    action_type: str,
    message: str,
    user_id: uuid.UUID | None = None,
    metadata: Dict[str, Any] | None = None,
) -> None:
    """Persist an activity log entry."""

    log = ActivityLog(
        user_id=user_id,
        action_type=action_type,
        message=message,
        log_metadata=metadata or {},
    )
    db.add(log)
    db.flush()

