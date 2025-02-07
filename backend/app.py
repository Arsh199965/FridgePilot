from flask import Flask
from flask_cors import CORS
from db import init_db
from auth import auth_bp
from pantry import pantry_bp
from others import others_bp
import os
from prediction import prediction_bp
from recipe_prediction import recipe_bp
from dotenv import load_dotenv
from flask import Response

load_dotenv()

FRONTEND = os.getenv("FRONTEND_URL", "*")  
app = Flask(__name__)

app.config["CORS_HEADERS"] = "Content-Type"

# Apply CORS globally
CORS(app, resources={r"/*": {"origins": FRONTEND}}, supports_credentials=True)

init_db()
@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pantry_bp, url_prefix="/pantry")
app.register_blueprint(others_bp, url_prefix="/others")
app.register_blueprint(prediction_bp, url_prefix="/prediction")
app.register_blueprint(recipe_bp, url_prefix="/recipe")

if __name__ == "__main__":
    app.run(debug=False)
