"""Utility helpers for encrypting OAuth tokens."""

from __future__ import annotations

from cryptography.fernet import Fernet, InvalidToken

from ..core.config import get_settings

settings = get_settings()
fernet = Fernet(settings.ENCRYPTION_KEY.encode("utf-8"))


def encrypt_token(token: str) -> str:
    """Encrypt sensitive OAuth tokens."""

    return fernet.encrypt(token.encode("utf-8")).decode("utf-8")


def decrypt_token(token: str) -> str:
    """Decrypt stored OAuth tokens."""

    try:
        return fernet.decrypt(token.encode("utf-8")).decode("utf-8")
    except InvalidToken as exc:  # pylint: disable=broad-except
        raise ValueError("Unable to decrypt token") from exc

