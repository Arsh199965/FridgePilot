from flask import Flask
from flask_cors import CORS
from db import init_db
from auth import auth_bp
from pantry import pantry_bp
from others import others_bp
from prediction import prediction_bp
from recipe_prediction import recipe_bp
app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app)
init_db()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pantry_bp, url_prefix="/pantry")
app.register_blueprint(others_bp, url_prefix="/others")
app.register_blueprint(prediction_bp, url_prefix="/prediction")
app.register_blueprint(recipe_bp, url_prefix="/recipe")


if __name__ == "__main__":
    app.run(debug=False)