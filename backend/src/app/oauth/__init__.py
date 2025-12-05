"""OAuth registry utilities."""

from __future__ import annotations

from typing import Dict

from ..core.config import Settings
from .base import BaseOAuthClient, OAuthTokens
from .facebook import FacebookOAuthClient
from .google import GoogleOAuthClient
from .instagram import InstagramOAuthClient
from .twitter import TwitterOAuthClient


def build_oauth_registry(settings: Settings) -> Dict[str, BaseOAuthClient]:
    """Instantiate OAuth clients for all providers."""

    return {
        "google": GoogleOAuthClient(
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET.get_secret_value(),
            redirect_uri=settings.GOOGLE_REDIRECT_URI,
            settings=settings,
        ),
        "instagram": InstagramOAuthClient(
            client_id=settings.INSTAGRAM_CLIENT_ID,
            client_secret=settings.INSTAGRAM_CLIENT_SECRET.get_secret_value(),
            redirect_uri=settings.INSTAGRAM_REDIRECT_URI,
            settings=settings,
        ),
        "facebook": FacebookOAuthClient(
            client_id=settings.FACEBOOK_CLIENT_ID,
            client_secret=settings.FACEBOOK_CLIENT_SECRET.get_secret_value(),
            redirect_uri=settings.FACEBOOK_REDIRECT_URI,
            settings=settings,
        ),
        "twitter": TwitterOAuthClient(
            client_id=settings.TWITTER_CLIENT_ID,
            client_secret=settings.TWITTER_CLIENT_SECRET.get_secret_value(),
            redirect_uri=settings.TWITTER_REDIRECT_URI,
            settings=settings,
        ),
    }


__all__ = ["BaseOAuthClient", "OAuthTokens", "build_oauth_registry"]

