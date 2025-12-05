"""Service that computes the global system health score."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..core.constants import SUPPORTED_PROVIDERS
from ..models import Anomaly, OAuthConnection, Signal, SystemHealth


class SystemHealthService:
    """Compute and persist system health scores."""

    def __init__(self, db: Session):
        self.db = db

    def update_score(self, user_id) -> SystemHealth:
        """Recalculate the health score for a user."""

        components = self._calculate_components(user_id)
        score = max(0, min(100, int(
            100
            - components["anomalies_score"]
            - components["signals_score"]
            - components["freshness_penalty"]
            + components["completeness_score"]
        )))

        instance = self.db.scalar(select(SystemHealth).where(SystemHealth.user_id == user_id))
        if instance:
            instance.score = score
            instance.components = components
        else:
            instance = SystemHealth(user_id=user_id, score=score, components=components)
            self.db.add(instance)
        self.db.flush()
        return instance

    def _calculate_components(self, user_id) -> dict:
        utcnow = datetime.now(timezone.utc)
        seven_days_ago = utcnow - timedelta(days=7)

        anomaly_stmt = select(func.count(Anomaly.id), func.coalesce(func.avg(Anomaly.risk_level), 0)).where(
            Anomaly.user_id == user_id, Anomaly.detected_at >= seven_days_ago
        )
        anomaly_count, avg_risk = self.db.execute(anomaly_stmt).one()
        anomalies_score = min(50, anomaly_count * (avg_risk or 1) * 2)

        signal_stmt = select(func.coalesce(func.avg(Signal.severity), 0)).where(
            Signal.user_id == user_id, Signal.created_at >= seven_days_ago
        )
        avg_signal_severity = self.db.scalar(signal_stmt) or 0
        signals_score = min(30, avg_signal_severity * 4)

        connected_count = self.db.scalar(
            select(func.count(OAuthConnection.id)).where(OAuthConnection.user_id == user_id)
        ) or 0
        completeness_score = (connected_count / len(SUPPORTED_PROVIDERS)) * 20

        last_sync = self.db.scalar(
            select(func.max(OAuthConnection.updated_at)).where(OAuthConnection.user_id == user_id)
        )
        freshness_hours = (utcnow - last_sync).total_seconds() / 3600 if last_sync else 999
        freshness_penalty = max(0, (freshness_hours - 6) * 2)

        return {
            "anomalies_score": round(anomalies_score, 2),
            "signals_score": round(signals_score, 2),
            "completeness_score": round(completeness_score, 2),
            "freshness_penalty": round(freshness_penalty, 2),
            "connected_providers": connected_count,
            "avg_signal_severity": round(avg_signal_severity, 2),
            "avg_risk_level": round(float(avg_risk or 0), 2),
            "last_sync": last_sync.isoformat() if last_sync else None,
        }

