from pydantic import BaseModel, validator, ValidationError
from typing import Any


class TrackerEventValidator(BaseModel):
    extension_user_id: str
    event_type: str
    metadata: Any = None

    @validator('event_type')
    def event_type_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('event_type must not be empty')
        return v

    @validator('extension_user_id')
    def extension_user_id_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('extension_user_id must not be empty')
        return v


def validate_tracker_event(data):
    try:
        event = TrackerEventValidator(**data)
        return event, None
    except ValidationError as e:
        return None, e.errors()
