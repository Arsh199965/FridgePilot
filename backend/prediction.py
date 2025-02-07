from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import pandas as pd
import joblib
APP_CATEGORY_MAPPING = {
    "dairy": [7],
    "meat": [10, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22, 25],
    "fruits": [18],
    "vegetables": [19],
    "baked": [2],
    "grains": [9],
    "spices": [3],
    "seafood": [8],
    "sauces": [6],
    "general": [1, 4, 5, 23, 24]
}

def get_category_id(web_category):
    web_category = web_category.lower()
    ids = APP_CATEGORY_MAPPING.get(web_category)
    if ids:
        return ids[0]
    return None

prediction_bp = Blueprint('prediction_bp', __name__)
model = joblib.load("improved_shelf_life_model.pkl")

def predict_expiry(product_name, web_category, buy_date_str):
    category_id = get_category_id(web_category)
    if category_id is None:
        return {"error": f"Unknown category: {web_category}"}
    sample = pd.DataFrame({
        'Name': [product_name],
        'Category_ID': [category_id],
        'HighLevelCategory': [web_category.lower()]
    })
    pred_days = model.predict(sample)[0]
    try:
        buy_date = datetime.strptime(buy_date_str, "%Y-%m-%d")
    except ValueError:
        return {"error": "buy_date must be YYYY-MM-DD"}
    expiry_date = buy_date + timedelta(days=int(round(pred_days)))
    return {"predicted_expiry_date": expiry_date.strftime("%Y-%m-%d")}

@prediction_bp.route('/predict', methods=['GET'])
def predict():
    product_name = request.args.get('name')
    web_category = request.args.get('category')
    buy_date_str = request.args.get('buy_date')
    if not all([product_name, web_category, buy_date_str]):
        return jsonify({"error": "Provide 'name', 'category', and 'buy_date'"}), 400
    result = predict_expiry(product_name, web_category, buy_date_str)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result)
