import os
from flask import Flask, send_from_directory
from pymongo import MongoClient

from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_BUILD = os.path.join(BASE_DIR, "frontend", "dist")

def create_app():
    app = Flask(
        __name__,
        static_folder=os.path.join(FRONTEND_BUILD, "assets"),
        template_folder=FRONTEND_BUILD
    )
    
    # create a MongoDB client
    client = MongoClient(os.environ.get("MONGO_URI", "mongodb://localhost:27017/myapp"))
    app.db = client.get_database()
    
    # register API routes so we can have api and React routes
    from api.routes import bp
    app.register_blueprint(bp)
    
    # serve React (catch-all other than api routes) proxy should handle this in dev
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        file_path = os.path.join(app.template_folder, path)
        if path and os.path.exists(file_path):
            return send_from_directory(app.template_folder, path)
        return send_from_directory(app.template_folder, "index.html")
    
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)