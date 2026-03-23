"""
Pranav Portfolio — Flask Backend
Entry point: registers all route blueprints
"""
from flask import Flask
from flask_cors import CORS

from routes.contact import contact_bp
from routes.resume  import resume_bp
from routes.github  import github_bp
from routes.stats   import stats_bp

app = Flask(__name__)

# Allow requests from your frontend origin
# For production, replace "*" with your actual domain, e.g.:
# CORS(app, origins=["https://pranav.dev"])
CORS(app)

# Register blueprints
app.register_blueprint(contact_bp, url_prefix="/api")
app.register_blueprint(resume_bp,  url_prefix="/api")
app.register_blueprint(github_bp,  url_prefix="/api")
app.register_blueprint(stats_bp,   url_prefix="/api")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
