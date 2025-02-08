import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_connection():
    """Get a connection to the database."""
    try:
        # Try to get the DATABASE_URL first (for production)
        DATABASE_URL = os.getenv('DATABASE_URL')
        
        if DATABASE_URL:
            # Use the URL directly if available (production)
            return psycopg2.connect(DATABASE_URL)
        else:
            # Fall back to individual credentials (development)
            return psycopg2.connect(
                dbname=os.getenv('DB_NAME'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                host=os.getenv('DB_HOST'),
                port=os.getenv('DB_PORT')
            )
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise

def init_db():
    """Initialize the database with required tables."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Create users table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(255) PRIMARY KEY,
                user_name VARCHAR(255),
                password VARCHAR(255)
            )
        """)
        
        # Create pantry_items table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pantry_items (
                id VARCHAR(255) PRIMARY KEY,
                user_id VARCHAR(255) REFERENCES users(user_id),
                item_name VARCHAR(255),
                quantity FLOAT,
                unit VARCHAR(50),
                category VARCHAR(50),
                expiry_date DATE,
                added_date DATE,
                notes TEXT
            )
        """)
        
        conn.commit()
    except Exception as e:
        print(f"Error initializing database: {e}")
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()
