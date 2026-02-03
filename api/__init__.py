from flask import Flask
from pymongo import MongoClient
import os

def create_app():
    app = Flask(__name__)
    
    client = MongoClient(os.environ.get("MONGODB_URI", "mongodb://localhost:27017/myapp"))
    app.db = client.get_database()
    
    from api.routes import bp
    app.register_blueprint(bp)
    
    return app