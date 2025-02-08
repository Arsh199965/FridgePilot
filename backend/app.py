from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from db import init_db
import os

# Import blueprints
from auth import auth_bp
from pantry import pantry_bp
from others import others_bp
from prediction import prediction_bp
from recipe_prediction import recipe_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# CORS configuration
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,https://fridgepilot.vercel.app').split(',')
CORS(app, resources={
    r"/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "allow_headers": ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Root endpoint
@app.route('/')
def hello_world():
    return jsonify({
        "message": "Welcome to FridgePilot API",
        "status": "healthy",
        "version": "1.0.0",
        "documentation": "/docs",  # For future API documentation
        "endpoints": {
            "auth": "/auth",
            "pantry": "/pantry",
            "others": "/others",
            "prediction": "/prediction",
            "recipe": "/recipe"
        }
    }), 200

# Initialize database
init_db()

# Register blueprints with URL prefixes
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pantry_bp, url_prefix="/pantry")
app.register_blueprint(others_bp, url_prefix="/others")
app.register_blueprint(prediction_bp, url_prefix="/prediction")
app.register_blueprint(recipe_bp, url_prefix="/recipe")

# Run the app
if __name__ == "__main__":
    import platform
    if platform.system() == 'Windows':
        try:
            from waitress import serve
            print("Starting Waitress server...")
            serve(app, host="0.0.0.0", port=5000)
        except ImportError:
            print("Waitress not installed. Running Flask development server...")
            app.run(host="0.0.0.0", port=5000, debug=False)
    else:
        app.run(host="0.0.0.0", port=5000, debug=False)
