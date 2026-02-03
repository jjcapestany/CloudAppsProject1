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

    # JWT Configuration
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-change-me')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 900))
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES', 604800))
    app.config['JWT_REMEMBER_ME_EXPIRES'] = int(os.environ.get('JWT_REMEMBER_ME_EXPIRES', 2592000))

    # Mail Configuration
    app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true'
    app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')
    app.config['FRONTEND_URL'] = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

    # Initialize Flask-Mail
    from api.mail import mail
    mail.init_app(app)

    # Create a MongoDB client
    client = MongoClient(os.environ.get("MONGODB_URI", "mongodb://localhost:27017/myapp"))
    app.db = client.get_database()

    # Create unique index on users email
    app.db.users.create_index("email", unique=True)

    # Register API routes
    from api.routes import bp
    app.register_blueprint(bp)

    # Register auth routes
    from api.auth.routes import auth_bp
    app.register_blueprint(auth_bp)

    # Serve React (catch-all other than api routes) proxy should handle this in dev
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