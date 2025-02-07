from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection

# Initialize blueprint
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Handle user registration"""
    try:
        # Get and validate request data
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        user_name = data.get("user_name", "").strip()
        user_id = data.get("user_id", "").strip()
        password = data.get("password", "").strip()

        # Validate required fields
        if not user_id or not password:
            return jsonify({"message": "Missing required fields"}), 400

        # Database operations
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(
                "INSERT INTO users (user_name, user_id, password) VALUES (%s, %s, %s)",
                (user_name, user_id, generate_password_hash(password))
            )
            conn.commit()
            return jsonify({"message": "User created successfully"}), 201

        except Exception as e:
            conn.rollback()
            # Check if error is due to duplicate user_id
            if "duplicate key" in str(e).lower():
                return jsonify({"message": "User already exists"}), 409
            return jsonify({"message": "Database error", "error": str(e)}), 500

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    """Handle user login"""
    try:
        # Get and validate request data
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        user_id = data.get("user_id", "").strip()
        password = data.get("password", "").strip()

        # Validate required fields
        if not user_id or not password:
            return jsonify({"message": "Missing required fields"}), 400

        # Database operations
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute("SELECT password FROM users WHERE user_id = %s", (user_id,))
            row = cursor.fetchone()

            if row and check_password_hash(row[0], password):
                return jsonify({
                    "message": "Login successful",
                    "user_id": user_id
                }), 200

            return jsonify({"message": "Invalid credentials"}), 401

        finally:
            cursor.close()
            conn.close()

    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500
