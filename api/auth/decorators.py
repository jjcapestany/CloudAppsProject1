from functools import wraps
from flask import request, jsonify, g, current_app
from bson import ObjectId
from api.auth.utils import decode_token


def jwt_required(f):
    """Decorator to require valid JWT access token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')

        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401

        token = auth_header.split(' ')[1]
        payload = decode_token(token)

        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401

        if payload.get('type') != 'access':
            return jsonify({'error': 'Invalid token type'}), 401

        # Fetch user from database and attach to g
        user = current_app.db.users.find_one({'_id': ObjectId(payload['sub'])})
        if not user or not user.get('is_active', True):
            return jsonify({'error': 'User not found or inactive'}), 401

        g.current_user = user
        g.current_user_id = str(user['_id'])

        return f(*args, **kwargs)
    return decorated
