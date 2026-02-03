from flask import Blueprint, request, jsonify, current_app, g
from bson import ObjectId

from api.auth.decorators import jwt_required

hardware_bp = Blueprint('hardware', __name__, url_prefix='/api/hardware')


@hardware_bp.route('', methods=['GET'])
@jwt_required
def get_hardware():
    """Get all hardware sets with availability."""
    hardware_sets = current_app.db.hardware.find()

    result = []
    for hw in hardware_sets:
        capacity = hw.get('capacity', 0)
        available = hw.get('available', 0)
        result.append({
            'set': hw['name'],
            'capacity': capacity,
            'available': available,
            'checkedOut': capacity - available
        })

    return jsonify(result), 200


@hardware_bp.route('/request', methods=['POST'])
@jwt_required
def request_hardware():
    """Check out hardware to a project."""
    data = request.get_json() or {}

    project_id = data.get('projectId', '').strip()
    requests = data.get('requests', [])  # [{set: "HW Set 1", quantity: 5}, ...]

    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400

    if not requests:
        return jsonify({'error': 'No hardware requested'}), 400

    # Validate project ID
    try:
        proj_obj_id = ObjectId(project_id)
    except Exception:
        return jsonify({'error': 'Invalid project ID format'}), 400

    # Check project exists and user is a member
    project = current_app.db.projects.find_one({'_id': proj_obj_id})
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    user_id = str(g.current_user['_id'])
    if user_id not in project.get('members', []):
        return jsonify({'error': 'You are not a member of this project'}), 403

    # Process each hardware request
    for req in requests:
        hw_name = req.get('set')
        quantity = req.get('quantity', 0)

        if quantity <= 0:
            continue

        # Find hardware set
        hw = current_app.db.hardware.find_one({'name': hw_name})
        if not hw:
            return jsonify({'error': f'Hardware set "{hw_name}" not found'}), 404

        if hw['available'] < quantity:
            return jsonify({
                'error': f'Not enough "{hw_name}" available. Requested: {quantity}, Available: {hw["available"]}'
            }), 400

        # Update hardware availability
        current_app.db.hardware.update_one(
            {'_id': hw['_id']},
            {'$inc': {'available': -quantity}}
        )

        # Update project allocation
        current_app.db.projects.update_one(
            {'_id': proj_obj_id, 'hw_allocations.hw_set_id': str(hw['_id'])},
            {'$inc': {'hw_allocations.$.count': quantity}}
        )

        # If no existing allocation, add new one
        result = current_app.db.projects.update_one(
            {'_id': proj_obj_id, 'hw_allocations.hw_set_id': {'$ne': str(hw['_id'])}},
            {'$push': {'hw_allocations': {'hw_set_id': str(hw['_id']), 'count': quantity}}}
        )

    return jsonify({'message': 'Hardware checked out successfully'}), 200


@hardware_bp.route('/return', methods=['POST'])
@jwt_required
def return_hardware():
    """Return hardware from a project."""
    data = request.get_json() or {}

    project_id = data.get('projectId', '').strip()
    returns = data.get('returns', [])  # [{set: "HW Set 1", quantity: 5}, ...]

    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400

    if not returns:
        return jsonify({'error': 'No hardware to return'}), 400

    # Validate project ID
    try:
        proj_obj_id = ObjectId(project_id)
    except Exception:
        return jsonify({'error': 'Invalid project ID format'}), 400

    # Check project exists and user is a member
    project = current_app.db.projects.find_one({'_id': proj_obj_id})
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    user_id = str(g.current_user['_id'])
    if user_id not in project.get('members', []):
        return jsonify({'error': 'You are not a member of this project'}), 403

    # Process each return
    for ret in returns:
        hw_name = ret.get('set')
        quantity = ret.get('quantity', 0)

        if quantity <= 0:
            continue

        # Find hardware set
        hw = current_app.db.hardware.find_one({'name': hw_name})
        if not hw:
            return jsonify({'error': f'Hardware set "{hw_name}" not found'}), 404

        # Check project has enough allocated
        hw_allocations = project.get('hw_allocations', [])
        allocation = next(
            (a for a in hw_allocations if a['hw_set_id'] == str(hw['_id'])),
            None
        )

        if not allocation or allocation['count'] < quantity:
            return jsonify({
                'error': f'Cannot return {quantity} of "{hw_name}". Project only has {allocation["count"] if allocation else 0}'
            }), 400

        # Update hardware availability (increase)
        current_app.db.hardware.update_one(
            {'_id': hw['_id']},
            {'$inc': {'available': quantity}}
        )

        # Update project allocation (decrease)
        current_app.db.projects.update_one(
            {'_id': proj_obj_id, 'hw_allocations.hw_set_id': str(hw['_id'])},
            {'$inc': {'hw_allocations.$.count': -quantity}}
        )

    return jsonify({'message': 'Hardware returned successfully'}), 200
