from flask import Flask, request, jsonify
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

# CORS configuration
@app.after_request
def add_cors_headers(response):
    # Get allowed origins from environment variable or use default
    allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,https://fridgepilot.vercel.app').split(',')
    origin = request.headers.get('Origin')
    
    # Check if the request origin is in our list of allowed origins
    if origin and (origin in allowed_origins or '*' in allowed_origins):
        response.headers['Access-Control-Allow-Origin'] = origin
    
    # Allow credentials
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    
    # Allow specific headers
    response.headers['Access-Control-Allow-Headers'] = (
        'Content-Type, Authorization, Accept, Origin, X-Requested-With'
    )
    
    # Allow specific methods
    response.headers['Access-Control-Allow-Methods'] = (
        'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    )
    
    # Cache preflight requests for 1 hour
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Max-Age'] = '3600'
    
    return response

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
