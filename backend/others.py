from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
from flask_cors import cross_origin
others_bp = Blueprint("others", __name__)

@others_bp.route("/get-name", methods=["GET"])
@cross_origin(origins="*")
def getname():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"message": "Missing user_id"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT user_name FROM users WHERE user_id = %s", (user_id,))
        
        # return jsonify({"message": "User name fetched"}), 201
    except:
        return jsonify({"message": "Could not find user"}), 400
    row = cursor.fetchone()   
    conn.close()
    return jsonify({"message": "User name fetched", "name": row[0]}), 200

@others_bp.route("/update-profile", methods=["PUT"])
@cross_origin(origins="*")
def update_profile():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"message": "Missing user_id"}), 400

    data = request.get_json()
    if not data:
        return jsonify({"message": "Missing payload"}), 400

    updates = []
    params = []
    if "name" in data and data["name"].strip():
        updates.append("user_name = %s")
        params.append(data["name"].strip())
    if "password" in data and data["password"].strip():
        updates.append("password = %s")
        params.append(generate_password_hash(data["password"].strip()))
    if not updates:
        return jsonify({"message": "No valid fields to update"}), 400

    params.append(user_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = f"UPDATE users SET {', '.join(updates)} WHERE user_id = %s"
        cursor.execute(query, tuple(params))
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"message": "Failed to update profile", "error": str(e)}), 400

    conn.close()
    return jsonify({"message": "Profile updated successfully"}), 200

@others_bp.route("/delete-profile", methods=["DELETE"])
@cross_origin(origins="*")
def delete_profile():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"message": "Missing user_id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Delete pantry items associated with the user
        cursor.execute("DELETE FROM pantry_items WHERE user_id = %s", (user_id,))
        # Delete user record
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"message": "Failed to delete profile", "error": str(e)}), 400

    conn.close()
    return jsonify({"message": "Profile and associated pantry items deleted successfully"}), 200