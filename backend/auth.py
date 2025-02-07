from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
from flask_cors import cross_origin

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
@cross_origin(origins="*")
def signup():
    data = request.get_json()
    user_name = data.get("user_name")
    user_id = data.get("user_id")
    password = data.get("password")

    if not user_id or not password:
        return jsonify({"message": "Missing user_id or password"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (user_name, user_id, password) VALUES (%s, %s, %s)",
            (user_name, user_id, generate_password_hash(password))
        )
        conn.commit()
        return jsonify({"message": "User created successfully"}), 201
    except:
        conn.rollback()
        return jsonify({"message": "User already exists"}), 400
    finally:
        conn.close()

@auth_bp.route("/login", methods=["POST"])
@cross_origin(origins="*")
def login():
    data = request.get_json()
    user_id = data.get("user_id")
    password = data.get("password")

    if not user_id or not password:
        return jsonify({"message": "Missing user_id or password"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE user_id = %s", (user_id,))
    row = cursor.fetchone()
    conn.close()

    if row and check_password_hash(row[0], password):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401
