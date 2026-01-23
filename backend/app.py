import os
from flask import Flask, send_from_directory

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_BUILD = os.path.join(BASE_DIR, "..", "frontend", "dist")

app = Flask(
    __name__,
    static_folder=os.path.join(FRONTEND_BUILD, "assets"),
    template_folder=FRONTEND_BUILD
)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    file_path = os.path.join(app.template_folder, path)

    if path and os.path.exists(file_path):
        return send_from_directory(app.template_folder, path)

    return send_from_directory(app.template_folder, "index.html")


if __name__ == "__main__":
    app.run(debug=True)