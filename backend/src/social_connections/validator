from typing import List
from fastapi import HTTPException, status


class PlatformValidator:
    """Validator for social media platforms"""

    VALID_PLATFORMS: List[str] = [
        "facebook",
        "instagram",
        "twitter",
        "tiktok",
        "linkedin",
        "youtube",
        "snapchat",
        "whatsapp",
        "telegram",
        "reddit",
    ]

    @staticmethod
    def validate_platform(platform: str) -> bool:
        """Validate platform is supported"""
        if platform.lower() not in PlatformValidator.VALID_PLATFORMS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Invalid platform. Supported: "
                    f"{', '.join(PlatformValidator.VALID_PLATFORMS)}"
                ),
            )
        return True

    @staticmethod
    def validate_handle(handle: str) -> bool:
        """Validate social media handle format"""
        if not handle or len(handle) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid handle. Must be at least 2 characters",
            )

        if len(handle) > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Handle too long. Maximum 100 characters",
            )

        return True

    @staticmethod
    def validate_profile_url(url: str) -> bool:
        """Validate profile URL format"""
        if not (url.startswith("http://") or url.startswith("https://")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="URL must start with http:// or https://",
            )
        return True
