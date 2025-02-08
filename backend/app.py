from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from db import init_db

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


CORS(app)  # Enables CORS for all routes

# Initialize database
init_db()


# Root endpoint
@app.route("/")
def hello_world():
    return (
        jsonify(
            {
                "message": "Welcome to FridgePilot API",
                "status": "healthy",
                "version": "1.0.0",
                "documentation": "/docs",  # For future API documentation
                "endpoints": {
                    "auth": "/auth",
                    "pantry": "/pantry",
                    "others": "/others",
                    "prediction": "/prediction",
                    "recipe": "/recipe",
                },
            }
        ),
        200,
    )


# Register blueprints with URL prefixes
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pantry_bp, url_prefix="/pantry")
app.register_blueprint(others_bp, url_prefix="/others")
app.register_blueprint(prediction_bp, url_prefix="/prediction")
app.register_blueprint(recipe_bp, url_prefix="/recipe")

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
