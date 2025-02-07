from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Union
import pandas as pd
import joblib

# Category mapping for the ML model
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

# Initialize blueprint
prediction_bp = Blueprint('prediction_bp', __name__)

# Load ML model
try:
    model = joblib.load("improved_shelf_life_model.pkl")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def get_category_id(web_category: str) -> Optional[int]:
    """Get the model category ID from web category.
    
    Args:
        web_category (str): Category name from web interface
        
    Returns:
        Optional[int]: Category ID for the model, None if category not found
    """
    web_category = web_category.lower()
    ids = APP_CATEGORY_MAPPING.get(web_category)
    return ids[0] if ids else None

def predict_expiry(
    product_name: str, 
    web_category: str, 
    buy_date_str: str
) -> Dict[str, Union[str, datetime]]:
    """Predict expiry date for a product.
    
    Args:
        product_name (str): Name of the product
        web_category (str): Category from web interface
        buy_date_str (str): Purchase date in YYYY-MM-DD format
        
    Returns:
        dict: Prediction result or error message
    """
    # Validate model is loaded
    if model is None:
        return {"error": "ML model not available"}
        
    # Get and validate category
    category_id = get_category_id(web_category)
    if category_id is None:
        return {"error": f"Unknown category: {web_category}"}
        
    try:
        # Prepare data for prediction
        sample = pd.DataFrame({
            'Name': [product_name],
            'Category_ID': [category_id],
            'HighLevelCategory': [web_category.lower()]
        })
        
        # Get prediction
        pred_days = model.predict(sample)[0]
        
        # Parse and validate buy date
        try:
            buy_date = datetime.strptime(buy_date_str, "%Y-%m-%d")
        except ValueError:
            return {"error": "buy_date must be in YYYY-MM-DD format"}
            
        # Calculate expiry date
        expiry_date = buy_date + timedelta(days=int(round(pred_days)))
        return {"predicted_expiry_date": expiry_date.strftime("%Y-%m-%d")}
        
    except Exception as e:
        return {"error": f"Prediction error: {str(e)}"}

@prediction_bp.route('/predict', methods=['GET'])
def predict() -> tuple[Dict[str, Any], int]:
    """Endpoint to predict product expiry date.
    
    Returns:
        tuple: (response_json, status_code)
    """
    try:
        # Get and validate parameters
        product_name = request.args.get('name')
        web_category = request.args.get('category')
        buy_date_str = request.args.get('buy_date')
        
        if not all([product_name, web_category, buy_date_str]):
            return jsonify({
                "error": "Missing required parameters. Provide 'name', 'category', and 'buy_date'"
            }), 400
            
        # Get prediction
        result = predict_expiry(product_name, web_category, buy_date_str)
        
        # Check for errors
        if "error" in result:
            return jsonify(result), 400
            
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "error": "Server error",
            "message": str(e)
        }), 500
