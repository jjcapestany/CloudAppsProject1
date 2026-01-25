from flask import Blueprint, jsonify, request, current_app

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/health')
def health():
    return jsonify({"status": "ok"})

@bp.route('/test', methods=['POST'])
def write_test():
    data = request.get_json()
    result = current_app.db.test.insert_one(data)
    return jsonify({"inserted_id": str(result.inserted_id)}), 201

@bp.route('/test', methods=['GET'])
def read_test():
    docs = list(current_app.db.test.find({}, {"_id": 0}))
    return jsonify(docs)