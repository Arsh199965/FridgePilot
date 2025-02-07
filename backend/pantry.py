from flask import Blueprint, request, jsonify
from db import get_db_connection
from typing import Dict, List, Any

# Initialize blueprint
pantry_bp = Blueprint("pantry", __name__)

@pantry_bp.route("/add-item", methods=["POST"])
def add_item() -> tuple[Dict[str, Any], int]:
    """Add a new item to user's pantry.
    
    Returns:
        tuple: (response_json, status_code)
    """
    try:
        # Validate request data
        data = request.get_json()
        user_id = request.args.get("user_id")
        if not user_id or not data or not data.get("item"):
            return jsonify({"message": "Missing user_id or item data"}), 400
        
        item = data["item"]
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                """
                INSERT INTO pantry_items 
                (id, user_id, item_name, quantity, expiry_date, category, unit, added_date, notes) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    item.get("id"), user_id, item.get("name"), 
                    item.get("quantity"), item.get("expiryDate"),
                    item.get("category"), item.get("unit"), 
                    item.get("addedDate"), item.get("notes")
                )
            )
            conn.commit()
            return jsonify({"message": "Item added successfully"}), 201
        except Exception as e:
            conn.rollback()
            return jsonify({"message": "Error adding item", "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500

@pantry_bp.route("/update-item", methods=["PUT"])
def update_item() -> tuple[Dict[str, Any], int]:
    """Update an existing pantry item.
    
    Returns:
        tuple: (response_json, status_code)
    """
    try:
        # Validate request data
        data = request.get_json()
        user_id = request.args.get("user_id")
        if not user_id or not data or not data.get("item"):
            return jsonify({"message": "Missing user_id or item data"}), 400

        item = data["item"]
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(
                """
                UPDATE pantry_items 
                SET item_name=%s, quantity=%s, expiry_date=%s, category=%s, 
                    unit=%s, added_date=%s, notes=%s 
                WHERE id=%s AND user_id=%s
                """,
                (
                    item.get("name"), item.get("quantity"), item.get("expiryDate"), 
                    item.get("category"), item.get("unit"), item.get("addedDate"), 
                    item.get("notes"), item.get("id"), user_id
                )
            )
            conn.commit()
            return jsonify({"message": "Item updated successfully"}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({"message": "Error updating item", "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500

@pantry_bp.route("/delete-item", methods=["DELETE"])
def delete_item() -> tuple[Dict[str, Any], int]:
    """Delete a pantry item.
    
    Returns:
        tuple: (response_json, status_code)
    """
    try:
        user_id = request.args.get("user_id")
        item_id = request.args.get("id")
        if not user_id or not item_id:
            return jsonify({"message": "Missing user_id or item id"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                "DELETE FROM pantry_items WHERE id=%s AND user_id=%s", 
                (item_id, user_id)
            )
            conn.commit()
            return jsonify({"message": "Item deleted successfully"}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({"message": "Error deleting item", "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500

@pantry_bp.route("/get-items", methods=["GET"])
def get_items() -> tuple[Dict[str, Any], int]:
    """Get all pantry items for a user.
    
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
                """
                SELECT id, item_name, quantity, unit, category, 
                       expiry_date, added_date, notes 
                FROM pantry_items 
                WHERE user_id=%s
                """,
                (user_id,)
            )
            rows = cursor.fetchall()
            
            items = [{
                "id": row[0],
                "name": row[1],
                "quantity": row[2],
                "unit": row[3],
                "category": row[4],
                "expiryDate": row[5],
                "addedDate": row[6],
                "notes": row[7]
            } for row in rows]

            return jsonify({
                "message": "Items retrieved successfully", 
                "data": items
            }), 200
        except Exception as e:
            return jsonify({"message": "Error fetching items", "error": str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500
