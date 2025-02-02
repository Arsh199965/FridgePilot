from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

users = {}     # Example user storage
pantry_items = [
    {
      "id": "1",
      "name": "Milk",
      "quantity": 2,
      "unit": "l",
      "category": "dairy",
      "expiryDate": "2024-02-10",
      "addedDate": "2024-02-01",
      "notes": "Full fat milk",
    },
    {
      "id": "2",
      "name": "Bread",
      "quantity": 1,
      "unit": "pieces",
      "category": "grains",
      "expiryDate": "2024-02-05",
      "addedDate": "2024-02-01",
      "notes": "Whole wheat",
    },
  ]  # Example pantry storage

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')
    if not user_id or not password:
        return jsonify({"message": "Missing user_id or password"}), 400
    if user_id in users:
        return jsonify({"message": "User already exists"}), 400
    hashed_password = generate_password_hash(password)
    users[user_id] = hashed_password
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_id = data.get('user_id')
    password = data.get('password')
    if not user_id or not password:
        return jsonify({"message": "Missing user_id or password"}), 400
    hashed_password = users.get(user_id)
    if hashed_password and check_password_hash(hashed_password, password):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/save-items', methods=['POST'])
def save_items():
    data = request.get_json()
    items = data.get('items', [])
    print(items)
    # Store in-memory for demonstration
    pantry_items.clear()
    pantry_items.extend(items)
    return jsonify({"message": "Items saved"}), 200
@app.route('/get-items', methods=['GET'])
def get_items():
    return jsonify({"message": "Items Received", "data":pantry_items}), 200

if __name__ == '__main__':
    app.run(debug=True)