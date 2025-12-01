from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from .models import PrivacyScore, SocialConnection
from src.auth.models import User
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class DashboardRepository:
    """Repository for dashboard-related database operations"""

    def __init__(self, db: Session):
        self.db = db

    async def get_user_privacy_scores(
        self,
        user_id: int,
        limit: int = 10
    ) -> List[PrivacyScore]:
        """Get recent privacy scores for a user"""
        return (
            self.db.query(PrivacyScore)
            .filter(PrivacyScore.user_id == user_id)
            .order_by(desc(PrivacyScore.date_recorded))
            .limit(limit)
            .all()
        )

    async def get_latest_privacy_score(
        self,
        user_id: int
    ) -> Optional[PrivacyScore]:
        """Get most recent privacy score"""
        return (
            self.db.query(PrivacyScore)
            .filter(PrivacyScore.user_id == user_id)
            .order_by(desc(PrivacyScore.date_recorded))
            .first()
        )

    async def create_privacy_score(
        self,
        user_id: int,
        score: float,
        category: Optional[str] = None
    ) -> PrivacyScore:
        """Create new privacy score record"""
        privacy_score = PrivacyScore(
            user_id=user_id,
            score=score,
            category=category
        )
        self.db.add(privacy_score)
        self.db.commit()
        self.db.refresh(privacy_score)
        logger.info(f"Privacy score created for user {user_id}: {score}")
        return privacy_score

    async def get_user_social_connections(
        self,
        user_id: int
    ) -> List[SocialConnection]:
        """Get all social connections for a user"""
        return (
            self.db.query(SocialConnection)
            .filter(SocialConnection.user_id == user_id)
            .all()
        )

    async def create_social_connection(
        self,
        user_id: int,
        platform: str,
        connection_count: int = 0,
        data_exposure: float = 0.0
    ) -> SocialConnection:
        """Create new social connection"""
        connection = SocialConnection(
            user_id=user_id,
            platform=platform,
            connection_count=connection_count,
            data_exposure=data_exposure,
        )
        self.db.add(connection)
        self.db.commit()
        self.db.refresh(connection)
        logger.info(f"Social connection created: {platform} for user {user_id}")
        return connection

    async def get_dashboard_stats(self) -> dict:
        """Get overall dashboard statistics"""
        total_users = self.db.query(func.count(User.id)).scalar()

        # Get latest scores for all users
        subquery = (
            self.db.query(
                PrivacyScore.user_id,
                func.max(PrivacyScore.date_recorded).label("max_date"),
            )
            .group_by(PrivacyScore.user_id)
            .subquery()
        )

        latest_scores = (
            self.db.query(PrivacyScore)
            .join(
                subquery,
                (PrivacyScore.user_id == subquery.c.user_id)
                & (PrivacyScore.date_recorded == subquery.c.max_date),
            )
            .all()
        )

        if latest_scores:
            avg_score = sum(s.score for s in latest_scores) / len(latest_scores)
            high_risk = sum(1 for s in latest_scores if s.score >= 70)
            medium_risk = sum(1 for s in latest_scores if 40 <= s.score < 70)
            low_risk = sum(1 for s in latest_scores if s.score < 40)
        else:
            avg_score = 0
            high_risk = medium_risk = low_risk = 0

        return {
            "total_users": total_users,
            "average_risk_score": round(avg_score, 2),
            "high_risk_users": high_risk,
            "medium_risk_users": medium_risk,
            "low_risk_users": low_risk,
        }

