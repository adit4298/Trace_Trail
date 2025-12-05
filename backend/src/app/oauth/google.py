"""Google OAuth client."""

from __future__ import annotations

from .base import BaseOAuthClient


class GoogleOAuthClient(BaseOAuthClient):
    provider = "google"
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    token_url = "https://oauth2.googleapis.com/token"
    profile_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    metadata_url = (
        "https://people.googleapis.com/v1/people/me/connections?"
        "personFields=names,emailAddresses,photos,organizations"
    )
    scopes = [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    ]

