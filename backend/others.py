from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from db import get_db_connection
from typing import Dict, Any, Tuple

# Initialize blueprint
others_bp = Blueprint("others", __name__)

@others_bp.route("/get-name", methods=["GET"])
def getname() -> Tuple[Dict[str, Any], int]:
    """Get user's name by user_id.
    
    Returns:
        tuple: (response_json, status_code)
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "Missing user_id"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(
                "SELECT user_name FROM users WHERE user_id = %s", 
                (user_id,)
            )
            row = cursor.fetchone()
            
            if row is None:
                return jsonify({"message": "User not found"}), 404
                
            return jsonify({
                "message": "User name retrieved successfully", 
                "name": row[0]
            }), 200
        except Exception as e:
            return jsonify({"message": "Error fetching user", "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500

@others_bp.route("/update-profile", methods=["PUT"])
def update_profile() -> Tuple[Dict[str, Any], int]:
    """Update user's profile information.
    
    Returns:
        tuple: (response_json, status_code)
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "Missing user_id"}), 400

        data = request.get_json()
        if not data:
            return jsonify({"message": "Missing request data"}), 400

        # Build update query dynamically but safely
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
            
            if cursor.rowcount == 0:
                return jsonify({"message": "User not found"}), 404
                
            return jsonify({"message": "Profile updated successfully"}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({"message": "Failed to update profile", "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500

@others_bp.route("/delete-profile", methods=["DELETE"])
def delete_profile() -> Tuple[Dict[str, Any], int]:
    """Delete user's profile and associated data.
    
    Returns:
        tuple: (response_json, status_code)
    """
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"message": "Missing user_id"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Start transaction
            cursor.execute("BEGIN")
            
            # Delete pantry items first (foreign key constraint)
            cursor.execute(
                "DELETE FROM pantry_items WHERE user_id = %s", 
                (user_id,)
            )
            
            # Delete user record
            cursor.execute(
                "DELETE FROM users WHERE user_id = %s", 
                (user_id,)
            )
            
            if cursor.rowcount == 0:
                cursor.execute("ROLLBACK")
                return jsonify({"message": "User not found"}), 404
            
            # Commit transaction
            cursor.execute("COMMIT")
            return jsonify({
                "message": "Profile and associated data deleted successfully"
            }), 200
        except Exception as e:
            cursor.execute("ROLLBACK")
            return jsonify({"message": "Failed to delete profile", "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500