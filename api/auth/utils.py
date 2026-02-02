import jwt
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
from flask import current_app
from api.auth.cipher import encrypt


# Cipher parameters for demonstration
CIPHER_N = 3
CIPHER_D = 1


def hash_password(password: str) -> str:
    """Hash password using custom cipher (for demonstration only)."""
    return encrypt(password, CIPHER_N, CIPHER_D)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash."""
    return encrypt(password, CIPHER_N, CIPHER_D) == password_hash


def create_access_token(user_id: str, remember_me: bool = False) -> Tuple[str, int]:
    """Create JWT access token. Returns (token, expires_in_seconds)."""
    if remember_me:
        expires_delta = int(current_app.config['JWT_REMEMBER_ME_EXPIRES'])
    else:
        expires_delta = int(current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])

    payload = {
        'sub': user_id,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(seconds=expires_delta),
        'type': 'access'
    }
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
    return token, expires_delta


def create_refresh_token(user_id: str, remember_me: bool = False) -> str:
    """Create JWT refresh token (longer-lived)."""
    if remember_me:
        expires_delta = int(current_app.config['JWT_REMEMBER_ME_EXPIRES'])
    else:
        expires_delta = int(current_app.config['JWT_REFRESH_TOKEN_EXPIRES'])

    payload = {
        'sub': user_id,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(seconds=expires_delta),
        'type': 'refresh'
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')


def decode_token(token: str) -> Optional[dict]:
    """Decode and validate JWT token. Returns payload or None if invalid."""
    try:
        return jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def generate_reset_token() -> str:
    """Generate secure random token for password reset."""
    return secrets.token_urlsafe(32)
