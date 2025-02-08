# FridgePilot Backend

This is the backend server for FridgePilot, built with Flask and PostgreSQL.

## Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## Setup Instructions

1. **Create a Virtual Environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/MacOS
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database Configuration
   DB_HOST=your_database_host
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_PORT=5432

   # CORS Configuration (comma-separated list)
   ALLOWED_ORIGINS=http://localhost:3000,https://fridgepilot.vercel.app
   ```

4. **Initialize Database**
   ```sql
   -- Run these commands in your PostgreSQL client

   CREATE TABLE users (
       user_id VARCHAR(255) PRIMARY KEY,
       user_name VARCHAR(255),
       password VARCHAR(255)
   );

   CREATE TABLE pantry_items (
       id VARCHAR(255) PRIMARY KEY,
       user_id VARCHAR(255) REFERENCES users(user_id),
       item_name VARCHAR(255),
       quantity FLOAT,
       unit VARCHAR(50),
       category VARCHAR(50),
       expiry_date DATE,
       added_date DATE,
       notes TEXT
   );
   ```

## Running the Server

1. **Development Mode**
   ```bash
   # With debug mode
   python app.py

   # Or with Flask CLI
   export FLASK_APP=app.py
   export FLASK_ENV=development
   flask run
   ```

2. **Production Mode**
   ```bash
   # Using gunicorn (recommended for production)
   gunicorn app:app -w 4 -b 0.0.0.0:5000
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user

### Pantry Management
- `GET /pantry/get-items` - Get all pantry items
- `POST /pantry/add-item` - Add a new item
- `PUT /pantry/update-item` - Update an item
- `DELETE /pantry/delete-item` - Delete an item

### User Profile
- `GET /others/get-name` - Get user's name
- `PUT /others/update-profile` - Update user profile
- `DELETE /others/delete-profile` - Delete user profile

### Predictions
- `GET /prediction/predict` - Get expiry date prediction
- `GET /recipe/predict` - Get recipe suggestions

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Development Notes

1. **CORS Configuration**
   - CORS is configured to accept requests from specified origins
   - Modify `ALLOWED_ORIGINS` in `.env` for your deployment

2. **Database Connections**
   - Connection pooling is implemented
   - Connections are automatically closed after each request

3. **Security**
   - Passwords are hashed using Werkzeug's security functions
   - SQL injection prevention through parameterized queries
   - CORS protection for cross-origin requests

## Deployment

1. **Requirements**
   - All dependencies are listed in `requirements.txt`
   - Python runtime is specified in `runtime.txt`

2. **Environment Variables**
   - Set all required environment variables in your deployment platform
   - Ensure database connection strings are properly configured

3. **Database Migration**
   - Run database initialization scripts
   - Ensure proper user permissions

4. **Monitoring**
   - Set up logging
   - Monitor server health and performance

## Troubleshooting

1. **Database Connection Issues**
   - Verify database credentials
   - Check network connectivity
   - Ensure proper permissions

2. **CORS Errors**
   - Verify allowed origins in environment variables
   - Check request headers
   - Ensure proper protocol (http/https)

3. **Model Loading Issues**
   - Verify model file exists
   - Check file permissions
   - Ensure compatible model version 