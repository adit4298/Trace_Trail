from sqlalchemy.orm import Session
from .repository import DashboardRepository
from .schemas import (
    DashboardOverview,
    PrivacyScoreResponse,
    SocialConnectionResponse,
    DashboardStats,
)
from src.users.repository import UserRepository
from src.shared.exceptions import UserNotFound
import logging

logger = logging.getLogger(__name__)


class DashboardService:
    """Service layer for dashboard business logic"""

    def __init__(self, db: Session):
        self.repository = DashboardRepository(db)
        self.user_repository = UserRepository(db)

    async def get_dashboard_overview(self, user_id: int) -> DashboardOverview:
        """
        Get complete dashboard overview for a user.
        Returns:
            DashboardOverview with all relevant data.
        """
        # Verify user exists
        user = await self.user_repository.get_user_by_id(user_id)
        if not user:
            raise UserNotFound()

        # Get privacy scores
        recent_scores = await self.repository.get_user_privacy_scores(user_id)
        latest_score = recent_scores[0] if recent_scores else None  # fixed [^0] → [0]

        # Get social connections
        connections = await self.repository.get_user_social_connections(user_id)

        # Determine risk category
        risk_category = None
        if latest_score:
            if latest_score.score >= 70:
                risk_category = "High"
            elif latest_score.score >= 40:
                risk_category = "Medium"
            else:
                risk_category = "Low"

        return DashboardOverview(
            user_id=user.id,
            username=user.username,
            current_risk_score=latest_score.score if latest_score else None,
            risk_category=risk_category,
            total_connections=len(connections),
            recent_scores=[
                PrivacyScoreResponse.from_orm(s) for s in recent_scores
            ],
            social_connections=[
                SocialConnectionResponse.from_orm(c) for c in connections
            ],
        )

    async def get_stats(self) -> DashboardStats:
        """Get overall dashboard statistics"""
        stats = await self.repository.get_dashboard_stats()
        return DashboardStats(**stats)

