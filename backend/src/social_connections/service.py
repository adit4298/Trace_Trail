from sqlalchemy.orm import Session
from .repository import SocialConnectionRepository
from .schemas import (
    SocialConnectionCreate,
    SocialConnectionUpdate,
    SocialConnectionResponse,
    SocialConnectionsList,
)
from .constants import SUPPORTED_PLATFORMS, PLATFORM_RISK_PROFILES
from src.shared.exceptions import InvalidPlatform
import random
import logging

logger = logging.getLogger(__name__)


class SocialConnectionService:
    """Service layer for social connections business logic"""

    def __init__(self, db: Session):
        self.repository = SocialConnectionRepository(db)

    async def add_connection(
        self,
        user_id: int,
        connection_data: SocialConnectionCreate,
    ) -> SocialConnectionResponse:
        """Add new social connection"""
        platform = connection_data.platform.lower()
        if platform not in SUPPORTED_PLATFORMS:
            raise InvalidPlatform(f"Platform {platform} is not supported")

        # Check if connection already exists
        existing = await self.repository.get_connection_by_platform(user_id, platform)
        if existing:
            raise ValueError(f"Connection to {platform} already exists")

        connection = await self.repository.create_connection(
            user_id=user_id,
            platform=platform,
            connection_count=connection_data.connection_count,
            data_exposure=connection_data.data_exposure,
        )
        return SocialConnectionResponse.from_orm(connection)

    async def get_all_connections(self, user_id: int) -> SocialConnectionsList:
        """Get all connections for user"""
        connections = await self.repository.get_user_connections(user_id)
        return SocialConnectionsList(
            connections=[SocialConnectionResponse.from_orm(c) for c in connections],
            total=len(connections),
        )

    async def update_connection(
        self,
        connection_id: int,
        update_data: SocialConnectionUpdate,
    ) -> SocialConnectionResponse:
        """Update social connection"""
        connection = await self.repository.update_connection(
            connection_id=connection_id,
            connection_count=update_data.connection_count,
            data_exposure=update_data.data_exposure,
        )
        return SocialConnectionResponse.from_orm(connection)

    async def delete_connection(self, connection_id: int) -> dict:
        """Delete social connection"""
        success = await self.repository.delete_connection(connection_id)
        if success:
            return {"message": "Connection deleted successfully"}
        else:
            raise ValueError("Connection not found")

    async def simulate_platform_sync(
        self,
        user_id: int,
        platform: str,
    ) -> SocialConnectionResponse:
        """
        Simulate syncing data from platform (for demo purposes).
        In production, this would use actual OAuth and platform APIs.
        """
        platform = platform.lower()
        if platform not in SUPPORTED_PLATFORMS:
            raise InvalidPlatform(f"Platform {platform} is not supported")

        # Generate realistic random data
        connection_count = random.randint(50, 1000)
        data_exposure = round(random.uniform(0.3, 0.9), 2)

        # Check if connection exists
        existing = await self.repository.get_connection_by_platform(user_id, platform)
        if existing:
            # Update existing connection
            connection = await self.repository.update_connection(
                connection_id=existing.id,
                connection_count=connection_count,
                data_exposure=data_exposure,
            )
        else:
            # Create new connection
            connection = await self.repository.create_connection(
                user_id=user_id,
                platform=platform,
                connection_count=connection_count,
                data_exposure=data_exposure,
            )

        logger.info(f"Platform synced: {platform} for user {user_id}")
        return SocialConnectionResponse.from_orm(connection)
