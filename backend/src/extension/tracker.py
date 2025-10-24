from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from src.core.database import Base


class TrackerEvent(Base):
    __tablename__ = "tracker_events"

    id = Column(Integer, primary_key=True, index=True)
    extension_user_id = Column(String, index=True)
    event_type = Column(String, index=True)
    event_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    metadata = Column(String, nullable=True)

    def __repr__(self):
        return (
            f"<TrackerEvent(id={self.id}, user_id={self.extension_user_id}, "
            f"type={self.event_type}, timestamp={self.event_timestamp})>"
        )
