"""Facebook OAuth client."""

from __future__ import annotations

from .base import BaseOAuthClient


class FacebookOAuthClient(BaseOAuthClient):
    provider = "facebook"
    auth_url = "https://www.facebook.com/v17.0/dialog/oauth"
    token_url = "https://graph.facebook.com/v17.0/oauth/access_token"
    profile_url = "https://graph.facebook.com/v17.0/me?fields=id,name,email,picture"
    metadata_url = "https://graph.facebook.com/v17.0/me/accounts"
    scopes = ["email", "public_profile", "pages_show_list"]

