from flask import Blueprint, request, jsonify
from recipes_recommender import recommend_recipes
from datetime import datetime
from db import get_db_connection

recipe_bp = Blueprint("recipe_bp", __name__)


def get_user_pantry(user_id):
    """
    Fetch user pantry items and their expiry dates.

    Returns:
      - ingredients: list of item names.
      - expiry_info: dict mapping item_name to days until expiry.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT item_name, expiry_date FROM pantry_items WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return [], {}

    ingredients = []
    expiry_info = {}
    today = datetime.today()

    for item_name, expiry_date_str in rows:
        ingredients.append(item_name)
        try:
            if expiry_date_str:  # Ensure expiry_date is not NULL
                expiry_date = datetime.strptime(expiry_date_str, "%Y-%m-%d")
                days_until = (expiry_date - today).days
                expiry_info[item_name] = days_until
            else:
                expiry_info[item_name] = 30  # Default if expiry date is missing
        except Exception:
            expiry_info[item_name] = 30  # Default if parsing fails

    return ingredients, expiry_info


@recipe_bp.route("/get-recipes", methods=["GET"])
def get_recipes():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing 'user_id' parameter."}), 400

    pantry, expiry_info = get_user_pantry(user_id)
    if not pantry:
        return jsonify({"error": "No pantry ingredients found for this user."}), 404

    recommendations = recommend_recipes(pantry, expiry_info, top_n=10)
    return jsonify({"recipes": recommendations})
