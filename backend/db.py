import sqlite3

DB_NAME = "pantrypal.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            user_id TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    # Create pantry_items table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pantry_items (
            id INTEGER PRIMARY KEY,
            user_id TEXT NOT NULL,
            item_name TEXT NOT NULL,
            quantity TEXT NOT NULL,
            unit TEXT NOT NULL,
            category TEXT NOT NULL,
            expiry_date TEXT ,
            added_date TEXT NOT NULL,
            notes TEXT,
            FOREIGN KEY(user_id) REFERENCES users(user_id)
        )
    """)
    conn.commit()
    conn.close()

def get_db_connection():
    return sqlite3.connect(DB_NAME)