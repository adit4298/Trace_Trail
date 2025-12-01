from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.core.database import Base


class ExtensionUser(Base):
    __tablename__ = "extension_users"

    id = Column(Integer, primary_key=True, index=True)
    extension_user_id = Column(String, unique=True, index=True)
    user_email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    social_connections = relationship("ExtensionSocialConnection", back_populates="extension_user")


class ExtensionSocialConnection(Base):
    __tablename__ = "extension_social_connections"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, index=True)
    username = Column(String)
    connected_at = Column(DateTime, default=datetime.utcnow)

    extension_user_id = Column(Integer, ForeignKey("extension_users.id"))
    extension_user = relationship("ExtensionUser", back_populates="social_connections")
