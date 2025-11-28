#!/usr/bin/env python3
"""
Create deterministic demo data for Trace Trail.

Usage:
    python scripts/database/seed_data.py
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta
from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parents[2] / "backend"
sys.path.insert(0, str(ROOT_DIR))

from src.core.database import SessionLocal  # type: ignore # noqa: E402
from src.core.security import get_password_hash  # type: ignore # noqa: E402
from src.auth.models import User  # type: ignore # noqa: E402
from src.dashboard.models import PrivacyScore, SocialConnection  # type: ignore # noqa: E402
from src.analysis.models import RiskAnalysis, Recommendation  # type: ignore # noqa: E402


USERS = [
    {
        "email": "demo@tracetrail.com",
        "username": "demo_user",
        "full_name": "Trace Demo",
        "password": "ChangeMe123!",
        "is_superuser": True,
    },
    {
        "email": "analyst@tracetrail.com",
        "username": "analyst",
        "full_name": "Analyst One",
        "password": "ChangeMe123!",
        "is_superuser": False,
    },
]


def upsert_user(session, payload) -> User:
    user = session.query(User).filter_by(email=payload["email"]).one_or_none()
    if user:
        return user
    user = User(
        email=payload["email"],
        username=payload["username"],
        full_name=payload["full_name"],
        hashed_password=get_password_hash(payload["password"]),
        is_active=True,
        is_superuser=payload["is_superuser"],
    )
    session.add(user)
    session.flush()
    return user


def seed_social_connections(session, user: User) -> None:
    existing = {conn.platform for conn in user.social_connections}
    platforms = [
        ("facebook", 3),
        ("instagram", 2),
        ("linkedin", 1),
    ]
    for platform, exposure in platforms:
        if platform in existing:
            continue
        session.add(
            SocialConnection(
                platform=platform,
                connection_count=random.randint(1, 10),
                data_exposure=0.2 * exposure,
                user_id=user.id,
            )
        )


def seed_privacy_scores(session, user: User) -> None:
    if user.privacy_scores:
        return
    for weeks_back in range(4, 0, -1):
        score = random.randint(60, 90)
        session.add(
            PrivacyScore(
                user_id=user.id,
                score=score,
                category="Low" if score >= 80 else "Medium",
                date_recorded=datetime.utcnow() - timedelta(weeks=weeks_back),
            )
        )


def seed_analysis(session, user: User) -> None:
    latest = (
        session.query(RiskAnalysis)
        .filter_by(user_id=user.id)
        .order_by(RiskAnalysis.analysis_date.desc())
        .first()
    )
    if latest:
        return

    risk_factors = {
        "factors": [
            {"name": "Public Instagram profile", "severity": "high"},
            {"name": "Leaked password reused", "severity": "medium"},
        ]
    }
    analysis = RiskAnalysis(
        user_id=user.id,
        overall_score=78.0,
        social_media_risk=65.0,
        data_exposure_risk=54.0,
        privacy_settings_risk=82.0,
        risk_factors=risk_factors,
        analysis_date=datetime.utcnow(),
        algorithm_version="1.0",
    )
    session.add(analysis)
    session.flush()

    recommendations = [
        {
            "title": "Lock Instagram account",
            "description": "Switch your Instagram account to private and review follower list.",
            "priority": "high",
            "category": "privacy",
            "impact_score": 0.84,
        },
        {
            "title": "Rotate LinkedIn password",
            "description": "Detected password reuse across breached services.",
            "priority": "medium",
            "category": "security",
            "impact_score": 0.66,
        },
    ]
    for rec in recommendations:
        session.add(
            Recommendation(
                analysis_id=analysis.id,
                user_id=user.id,
                title=rec["title"],
                description=rec["description"],
                priority=rec["priority"],
                category=rec["category"],
                impact_score=rec["impact_score"],
            )
        )


def main() -> None:
    session = SessionLocal()
    try:
        for payload in USERS:
            user = upsert_user(session, payload)
            seed_social_connections(session, user)
            seed_privacy_scores(session, user)
            seed_analysis(session, user)
        session.commit()
        print("✔ Seed data applied successfully.")
    except Exception as exc:  # noqa: BLE001
        session.rollback()
        raise SystemExit(f"Failed to seed database: {exc}") from exc
    finally:
        session.close()


if __name__ == "__main__":
    main()
