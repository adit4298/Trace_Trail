from sqlalchemy.orm import Session
from .repository import UserRepository
from .schemas import UserProfileUpdate, UserDetailResponse
from src.auth.models import User
import logging

logger = logging.getLogger(__name__)


class UserService:
    """Service layer for user management business logic"""

    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    async def get_user_profile(self, user_id: int) -> UserDetailResponse:
        """Get detailed user profile with statistics"""
        user_data = await self.repository.get_user_with_stats(user_id)
        return UserDetailResponse(
            id=user_data["user"].id,
            email=user_data["user"].email,
            username=user_data["user"].username,
            full_name=user_data["user"].full_name,
            is_active=user_data["user"].is_active,
            created_at=user_data["user"].created_at,
            updated_at=user_data["user"].updated_at,
            total_connections=user_data["total_connections"],
            current_risk_score=user_data["current_risk_score"],
            challenges_completed=user_data["challenges_completed"],
        )

    async def update_profile(
        self,
        user_id: int,
        update_data: UserProfileUpdate
    ) -> User:
        """Update user profile"""
        return await self.repository.update_user_profile(
            user_id=user_id,
            full_name=update_data.full_name,
            email=update_data.email,
            username=update_data.username
        )

    async def delete_account(self, user_id: int) -> dict:
        """Delete user account"""
        await self.repository.delete_user(user_id)
        return {"message": "Account deleted successfully"}

    async def get_all_users(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> dict:
        """Get paginated list of users"""
        users, total = await self.repository.get_all_users(skip, limit)
        return {
            "users": users,
            "total": total,
            "page": skip // limit + 1,
            "page_size": limit,
        }
