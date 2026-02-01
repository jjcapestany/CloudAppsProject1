import re
from datetime import datetime, timezone


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password(password: str) -> tuple[bool, str]:
    """Validate password strength. Returns (is_valid, error_message)."""
    if len(password) < 8:
        return False, 'Password must be at least 8 characters'
    return True, ''


def create_user_document(email: str, password_hash: str) -> dict:
    """Create a new user document for MongoDB."""
    now = datetime.now(timezone.utc)
    return {
        'email': email.lower().strip(),
        'password_hash': password_hash,
        'created_at': now,
        'updated_at': now,
        'is_active': True,
        'reset_token': None,
        'reset_token_expires': None,
    }


def user_to_response(user: dict) -> dict:
    """Convert MongoDB user document to API response format."""
    return {
        'id': str(user['_id']),
        'email': user['email'],
    }
