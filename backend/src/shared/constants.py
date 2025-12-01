"""
Shared constants used across the application
"""

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
MIN_PAGE_SIZE = 1

# Privacy Scores
MIN_PRIVACY_SCORE = 0
MAX_PRIVACY_SCORE = 100

# Risk Categories
RISK_CATEGORIES = {
    "low": (80, 100),
    "medium": (50, 79),
    "high": (20, 49),
    "critical": (0, 19)
}

# User Status
USER_STATUS_ACTIVE = "active"
USER_STATUS_INACTIVE = "inactive"
USER_STATUS_SUSPENDED = "suspended"

# Platform Types
PLATFORM_TYPES = [
    "social_media",
    "messaging",
    "email",
    "streaming",
    "other"
]

# Cache Settings
CACHE_TTL_SECONDS = 3600  # 1 hour
CACHE_LONG_TTL = 86400    # 24 hours

# API Limits
MAX_BULK_OPERATIONS = 100
MAX_FILE_UPLOAD_SIZE_MB = 10
REQUEST_TIMEOUT_SECONDS = 30

# Error Messages
ERROR_INVALID_REQUEST = "Invalid request data"
ERROR_RESOURCE_NOT_FOUND = "Resource not found"
ERROR_UNAUTHORIZED = "Unauthorized access"
ERROR_PERMISSION_DENIED = "Permission denied"

# Success Messages
SUCCESS_CREATED = "Resource created successfully"
SUCCESS_UPDATED = "Resource updated successfully"
SUCCESS_DELETED = "Resource deleted successfully"
