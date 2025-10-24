from sqlalchemy.orm import Session
from src.extension import repository, models, schemas


class ExtensionService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = repository.ExtensionRepository(db)

    async def create_user(self, user_create: schemas.ExtensionUserCreate) -> models.ExtensionUser:
        user = models.ExtensionUser(
            extension_user_id=user_create.extension_user_id,
            user_email=user_create.user_email,
        )
        return await self.repo.create_extension_user(user)

    async def add_connection(self, extension_user_id: int, connection_data: schemas.ExtensionSocialConnectionCreate):
        return await self.repo.add_social_connection(
            extension_user_id=extension_user_id,
            platform=connection_data.platform,
            username=connection_data.username
        )

    async def list_connections(self, extension_user_id: int):
        return await self.repo.get_social_connections(extension_user_id)
