from sqlalchemy.orm import Session
from src.extension import models
from typing import Optional, List


class ExtensionRepository:
    def __init__(self, db: Session):
        self.db = db

    async def get_user_by_extension_id(self, extension_user_id: str) -> Optional[models.ExtensionUser]:
        return self.db.query(models.ExtensionUser).filter(
            models.ExtensionUser.extension_user_id == extension_user_id
        ).first()

    async def create_extension_user(self, user: models.ExtensionUser) -> models.ExtensionUser:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    async def add_social_connection(
        self,
        extension_user_id: int,
        platform: str,
        username: str
    ) -> models.ExtensionSocialConnection:
        social_connection = models.ExtensionSocialConnection(
            extension_user_id=extension_user_id,
            platform=platform,
            username=username
        )
        self.db.add(social_connection)
        self.db.commit()
        self.db.refresh(social_connection)
        return social_connection

    async def get_social_connections(self, extension_user_id: int) -> List[models.ExtensionSocialConnection]:
        return self.db.query(models.ExtensionSocialConnection).filter(
            models.ExtensionSocialConnection.extension_user_id == extension_user_id
        ).all()
