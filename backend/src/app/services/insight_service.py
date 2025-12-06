"""Service that composes AI-style insights from recent telemetry."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from ..models import AIInsight, Anomaly, Signal, SystemHealth


class InsightService:
    """Create lightweight risk summaries based on existing data."""

    def __init__(self, db: Session):
        self.db = db

    def latest(self, user_id):
        return self.db.scalar(
            select(AIInsight).where(AIInsight.user_id == user_id).order_by(desc(AIInsight.created_at))
        )

    def generate(self, user_id) -> AIInsight:
        utcnow = datetime.now(timezone.utc)
        day_ago = utcnow - timedelta(days=1)

        signal_stats = self.db.execute(
            select(
                func.count(Signal.id),
                func.coalesce(func.avg(Signal.severity), 0),
            ).where(Signal.user_id == user_id, Signal.created_at >= day_ago)
        ).one()
        signal_count, avg_severity = signal_stats

        anomaly_stats = self.db.execute(
            select(
                func.count(Anomaly.id),
                func.coalesce(func.avg(Anomaly.risk_level), 0),
            ).where(Anomaly.user_id == user_id, Anomaly.detected_at >= day_ago)
        ).one()
        anomaly_count, avg_risk = anomaly_stats

        health = self.db.scalar(select(SystemHealth).where(SystemHealth.user_id == user_id))
        health_score = health.score if health else 50

        summary = (
            f"System health is {health_score}/100. "
            f"{signal_count} signals processed with average severity {avg_severity:.1f}. "
            f"{anomaly_count} anomalies detected with average risk {avg_risk:.1f}."
        )
        recommendations = []
        if anomaly_count > 0:
            recommendations.append("Review recent anomalies to confirm legitimacy.")
        if avg_severity >= 4:
            recommendations.append("Signals are trending hot; tighten alert thresholds.")
        if not recommendations:
            recommendations.append("Everything looks stable. Continue monitoring automated syncs.")

        content = summary + " Recommendations: " + " ".join(recommendations)
        metadata = {
            "signal_count": int(signal_count or 0),
            "avg_signal_severity": float(avg_severity or 0),
            "anomaly_count": int(anomaly_count or 0),
            "avg_anomaly_risk": float(avg_risk or 0),
            "health_score": health_score,
        }

        insight = AIInsight(
            user_id=user_id,
            insight_type="risk_summary",
            content=content,
            insight_metadata=metadata,
        )
        self.db.add(insight)
        self.db.flush()
        return insight

