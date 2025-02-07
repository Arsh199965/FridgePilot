from flask import Flask, request
from db import init_db
from auth import auth_bp
from pantry import pantry_bp
from others import others_bp
from prediction import prediction_bp
from recipe_prediction import recipe_bp
from dotenv import load_dotenv
from flask_cors import CORS

# from flask import Response
# import os

load_dotenv()

app = Flask(__name__)

# Basic CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Allow all origins
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept", "Origin"],
    }
})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

init_db()


# @app.after_request
# def add_header(response):
#     response.headers['Access-Control-Allow-Origin'] = '*'
#     return response

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pantry_bp, url_prefix="/pantry")
app.register_blueprint(others_bp, url_prefix="/others")
app.register_blueprint(prediction_bp, url_prefix="/prediction")
app.register_blueprint(recipe_bp, url_prefix="/recipe")

if __name__ == "__main__":
    app.run(debug=False)
