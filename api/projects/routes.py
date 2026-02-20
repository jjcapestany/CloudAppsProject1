from flask import Blueprint, request, jsonify, current_app, g
from bson import ObjectId

from api.auth.decorators import jwt_required

projects_bp = Blueprint('projects', __name__, url_prefix='/api/projects')


@projects_bp.route('', methods=['GET'])
@jwt_required
def get_user_projects():
    """Get all projects for the current user."""
    user_id = str(g.current_user['_id'])

    # Find projects where user is a member
    projects = current_app.db.projects.find({'members': user_id})

    # Convert to list and format response
    result = []
    for project in projects:
        result.append({
            'id': str(project['project_id']),
            'name': project['name'],
            'description': project.get('description', '')
        })

    return jsonify(result), 200


@projects_bp.route('', methods=['POST'])
@jwt_required
def create_project():
    """Create a new project."""
    data = request.get_json() or {}

    name = data.get('name', '').strip()
    description = data.get('description', '').strip()
    project_id = data.get('id', '').strip()

    # Validation
    if not name:
        return jsonify({'error': 'Project name is required'}), 400
    
    if not description:
        return jsonify({'error': 'Project description is required'}), 400
    
    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400

    user_id = str(g.current_user['_id'])

    # Create project document
    project_doc = {
        'name': name,
        'project_id': project_id,
        'description': description,
        'members': [user_id],  # Creator is first member
        'hw_allocations': []   # No hardware allocated initially
    }

    result = current_app.db.projects.insert_one(project_doc)
    project_doc['_id'] = result.inserted_id

    return jsonify({
        'id': project_doc['project_id'],
        'name': project_doc['name'],
        'description': project_doc['description']
    }), 201


@projects_bp.route('/join', methods=['POST'])
@jwt_required
def join_project():
    """Join an existing project."""
    data = request.get_json() or {}

    project_id = data.get('projectId', '').strip()

    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400

    # Find the project
    project = current_app.db.projects.find_one({'project_id': project_id})
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    user_id = str(g.current_user['_id'])

    # Extract the ObjectId for update
    obj_id = str(project['_id'])

    # Check if already a member
    if user_id in project.get('members', []):
        return jsonify({'error': 'Already a member of this project'}), 400

    # Add user to members
    current_app.db.projects.update_one(
        {'_id': ObjectId(obj_id)},
        {'$push': {'members': user_id}}
    )

    return jsonify({
        'id': project['project_id'],
        'name': project['name'],
        'description': project.get('description', '')
    }), 200
