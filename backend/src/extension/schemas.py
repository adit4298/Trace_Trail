from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ExtensionUserBase(BaseModel):
    extension_user_id: str
    user_email: str


class ExtensionUserCreate(ExtensionUserBase):
    pass


class ExtensionSocialConnectionBase(BaseModel):
    platform: str
    username: str


class ExtensionSocialConnectionCreate(ExtensionSocialConnectionBase):
    pass


class ExtensionSocialConnectionResponse(ExtensionSocialConnectionBase):
    id: int
    connected_at: datetime

    class Config:
        orm_mode = True


class ExtensionUserResponse(ExtensionUserBase):
    id: int
    created_at: datetime
    social_connections: List[ExtensionSocialConnectionResponse] = []

    class Config:
        orm_mode = True
