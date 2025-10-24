from sqlalchemy.orm import Session
from src.dashboard.models import SocialConnection
from typing import List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class SocialConnectionRepository:
    """Repository for social connections database operations"""

    def __init__(self, db: Session):
        self.db = db

    async def create_connection(
        self,
        user_id: int,
        platform: str,
        connection_count: int = 0,
        data_exposure: float = 0.0,
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

    async def get_user_connections(self, user_id: int) -> List[SocialConnection]:
        """Get all connections for user"""
        return (
            self.db.query(SocialConnection)
            .filter(SocialConnection.user_id == user_id)
            .all()
        )

    async def get_connection_by_platform(
        self,
        user_id: int,
        platform: str,
    ) -> Optional[SocialConnection]:
        """Get specific platform connection"""
        return (
            self.db.query(SocialConnection)
            .filter(
                SocialConnection.user_id == user_id,
                SocialConnection.platform == platform,
            )
            .first()
        )

    async def update_connection(
        self,
        connection_id: int,
        connection_count: Optional[int] = None,
        data_exposure: Optional[float] = None,
    ) -> SocialConnection:
        """Update social connection"""
        connection = (
            self.db.query(SocialConnection)
            .filter(SocialConnection.id == connection_id)
            .first()
        )

        if connection:
            if connection_count is not None:
                connection.connection_count = connection_count
            if data_exposure is not None:
                connection.data_exposure = data_exposure
            connection.last_synced = datetime.utcnow()
            self.db.commit()
            self.db.refresh(connection)
            logger.info(f"Connection updated: {connection.platform}")
        return connection

    async def delete_connection(self, connection_id: int) -> bool:
        """Delete social connection"""
        connection = (
            self.db.query(SocialConnection)
            .filter(SocialConnection.id == connection_id)
            .first()
        )
        if connection:
            self.db.delete(connection)
            self.db.commit()
            logger.info(f"Connection deleted: {connection.platform}")
            return True
        return False
