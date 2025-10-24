from sqlalchemy.orm import Session
from sqlalchemy import func
from src.auth.models import User
from src.shared.exceptions import UserNotFound
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class UserRepository:
    """Repository for user-related database operations"""

    def __init__(self, db: Session):
        self.db = db

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    async def get_all_users(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> tuple[List[User], int]:
        """
        Get paginated list of users.
        Returns:
            Tuple of (users list, total count)
        """
        total = self.db.query(func.count(User.id)).scalar()
        users = self.db.query(User).offset(skip).limit(limit).all()
        return users, total

    async def update_user_profile(
        self,
        user_id: int,
        full_name: Optional[str] = None,
        email: Optional[str] = None,
        username: Optional[str] = None
    ) -> User:
        """Update user profile information"""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise UserNotFound()

        if full_name is not None:
            user.full_name = full_name
        if email is not None:
            user.email = email
        if username is not None:
            user.username = username

        self.db.commit()
        self.db.refresh(user)
        logger.info(f"User profile updated: {user.email}")
        return user

    async def delete_user(self, user_id: int) -> bool:
        """Delete user account"""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise UserNotFound()

        self.db.delete(user)
        self.db.commit()
        logger.info(f"User deleted: {user.email}")
        return True

    async def get_user_with_stats(self, user_id: int) -> dict:
        """
        Get user with computed statistics.
        Returns dict with user info and stats:
        - total_connections
        - current_risk_score
        - challenges_completed
        """
        user = await self.get_user_by_id(user_id)
        if not user:
            raise UserNotFound()

        # Import here to avoid circular imports
        from src.social_connections.models import SocialConnection
        from src.dashboard.models import PrivacyScore
        from src.challenges.models import CompletedChallenge

        # Get statistics
        total_connections = self.db.query(func.count(SocialConnection.id)).filter(
            SocialConnection.user_id == user_id
        ).scalar()

        latest_score = self.db.query(PrivacyScore).filter(
            PrivacyScore.user_id == user_id
        ).order_by(PrivacyScore.date_recorded.desc()).first()

        challenges_completed = self.db.query(func.count(CompletedChallenge.id)).filter(
            CompletedChallenge.user_id == user_id
        ).scalar()

        return {
            "user": user,
            "total_connections": total_connections or 0,
            "current_risk_score": latest_score.score if latest_score else None,
            "challenges_completed": challenges_completed or 0
        }
