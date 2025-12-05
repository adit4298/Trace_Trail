"""Instagram OAuth client leveraging Facebook Graph API."""

from __future__ import annotations

from .base import BaseOAuthClient


class InstagramOAuthClient(BaseOAuthClient):
    provider = "instagram"
    auth_url = "https://api.instagram.com/oauth/authorize"
    token_url = "https://api.instagram.com/oauth/access_token"
    profile_url = "https://graph.facebook.com/v17.0/me"
    metadata_url = "https://graph.facebook.com/v17.0/me/media"
    scopes = ["user_profile", "user_media"]

