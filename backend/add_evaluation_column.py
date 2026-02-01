"""
Migration script to add evaluation column to interview_sessions table
"""
import sqlite3
import os

# Path to database
db_path = os.path.join(os.path.dirname(__file__), 'instance', 'truemirror.db')

print(f"[INFO] Connecting to database: {db_path}")

# Connect to database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Check if column already exists
    cursor.execute("PRAGMA table_info(interview_sessions)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'evaluation' in columns:
        print("[INFO] Column 'evaluation' already exists. No migration needed.")
    else:
        print("[INFO] Adding 'evaluation' column to interview_sessions table...")
        cursor.execute("ALTER TABLE interview_sessions ADD COLUMN evaluation TEXT")
        conn.commit()
        print("[SUCCESS] Column 'evaluation' added successfully!")
    
    # Verify the change
    cursor.execute("PRAGMA table_info(interview_sessions)")
    columns = cursor.fetchall()
    print("\n[INFO] Current table structure:")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")
    
except Exception as e:
    print(f"[ERROR] Migration failed: {str(e)}")
    conn.rollback()
finally:
    conn.close()
    print("\n[INFO] Database connection closed.")
