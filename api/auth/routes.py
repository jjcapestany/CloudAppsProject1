from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, current_app, g
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from api.auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    generate_reset_token,
)
from api.auth.models import (
    validate_email,
    validate_password,
    create_user_document,
    user_to_response,
)
from api.auth.decorators import jwt_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json() or {}

    email = data.get('email', '').strip()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    # Validation
    if not email or not password or not confirm_password:
        return jsonify({'error': 'Email, password, and confirm_password are required'}), 400

    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    is_valid, error_msg = validate_password(password)
    if not is_valid:
        return jsonify({'error': error_msg}), 400

    # Create user
    password_hash = hash_password(password)
    user_doc = create_user_document(email, password_hash)

    try:
        result = current_app.db.users.insert_one(user_doc)
        user_doc['_id'] = result.inserted_id
    except DuplicateKeyError:
        return jsonify({'error': 'Email already registered'}), 409

    return jsonify({
        'message': 'User registered successfully',
        'user': user_to_response(user_doc)
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return tokens."""
    data = request.get_json() or {}

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    remember_me = data.get('remember_me', False)

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Find user
    user = current_app.db.users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Verify password
    if not verify_password(password, user['password_hash']):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Check if user is active
    if not user.get('is_active', True):
        return jsonify({'error': 'Account is inactive'}), 401

    # Generate tokens
    user_id = str(user['_id'])
    access_token, expires_in = create_access_token(user_id, remember_me)
    refresh_token = create_refresh_token(user_id, remember_me)

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'Bearer',
        'expires_in': expires_in,
        'user': user_to_response(user)
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Get new access token using refresh token."""
    data = request.get_json() or {}
    refresh_token = data.get('refresh_token', '')

    if not refresh_token:
        return jsonify({'error': 'Refresh token is required'}), 400

    payload = decode_token(refresh_token)
    if not payload:
        return jsonify({'error': 'Invalid or expired refresh token'}), 401

    if payload.get('type') != 'refresh':
        return jsonify({'error': 'Invalid token type'}), 401

    # Verify user still exists and is active
    user = current_app.db.users.find_one({'_id': ObjectId(payload['sub'])})
    if not user or not user.get('is_active', True):
        return jsonify({'error': 'User not found or inactive'}), 401

    # Generate new access token
    access_token, expires_in = create_access_token(str(user['_id']))

    return jsonify({
        'access_token': access_token,
        'expires_in': expires_in
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required
def get_current_user():
    """Get current authenticated user."""
    return jsonify({
        'user': user_to_response(g.current_user)
    }), 200


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset email."""
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()

    # Always return success to prevent email enumeration
    success_response = jsonify({
        'message': 'If an account exists with this email, a reset link has been sent'
    }), 200

    if not email:
        return success_response

    user = current_app.db.users.find_one({'email': email})
    if not user:
        return success_response

    # Generate reset token
    reset_token = generate_reset_token()
    reset_expires = datetime.now(timezone.utc) + timedelta(hours=1)

    # Store hashed token in database
    current_app.db.users.update_one(
        {'_id': user['_id']},
        {'$set': {
            'reset_token': reset_token,
            'reset_token_expires': reset_expires,
            'updated_at': datetime.now(timezone.utc)
        }}
    )

    # Send email (if mail is configured)
    try:
        from api.mail import send_password_reset_email
        send_password_reset_email(email, reset_token)
    except Exception as e:
        # Log error but don't expose to user
        current_app.logger.error(f'Failed to send reset email: {e}')

    return success_response


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password using token from email."""
    data = request.get_json() or {}

    token = data.get('token', '')
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not token or not password or not confirm_password:
        return jsonify({'error': 'Token, password, and confirm_password are required'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    is_valid, error_msg = validate_password(password)
    if not is_valid:
        return jsonify({'error': error_msg}), 400

    # Find user with valid reset token
    user = current_app.db.users.find_one({
        'reset_token': token,
        'reset_token_expires': {'$gt': datetime.now(timezone.utc)}
    })

    if not user:
        return jsonify({'error': 'Invalid or expired reset token'}), 400

    # Update password and clear reset token
    password_hash = hash_password(password)
    current_app.db.users.update_one(
        {'_id': user['_id']},
        {'$set': {
            'password_hash': password_hash,
            'reset_token': None,
            'reset_token_expires': None,
            'updated_at': datetime.now(timezone.utc)
        }}
    )

    return jsonify({'message': 'Password reset successfully'}), 200
