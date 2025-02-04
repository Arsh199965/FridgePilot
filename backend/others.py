from flask import Blueprint, request, jsonify
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
        cursor.execute("SELECT user_name FROM users WHERE user_id = ?", (user_id,))
        
        # return jsonify({"message": "User name fetched"}), 201
    except:
        return jsonify({"message": "Could not find user"}), 400
    row = cursor.fetchone()   
    conn.close()
    return jsonify({"message": "User name fetched", "name": row[0]}), 200

