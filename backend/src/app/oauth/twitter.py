"""Twitter/X OAuth client."""

from __future__ import annotations

from .base import BaseOAuthClient


class TwitterOAuthClient(BaseOAuthClient):
    provider = "twitter"
    auth_url = "https://twitter.com/i/oauth2/authorize"
    token_url = "https://api.twitter.com/2/oauth2/token"
    profile_url = "https://api.twitter.com/2/users/me"
    metadata_url = "https://api.twitter.com/2/users/me/tweets"
    scopes = [
        "tweet.read",
        "users.read",
        "offline.access",
    ]

