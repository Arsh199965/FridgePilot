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
    app.run(debug=False)
