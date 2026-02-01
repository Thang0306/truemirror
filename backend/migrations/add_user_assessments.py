"""
Migration: Add user_assessments table
Creates a table to store AI-generated assessments for users
Only stores the most recent assessment per user

Usage:
    python backend/migrations/add_user_assessments.py
"""

import sys
import os

# Add parent directory to path to import models
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import db
from app import create_app
from sqlalchemy import text

def run_migration():
    """Run the migration to add user assessments table."""
    app = create_app()

    with app.app_context():
        print("[Migration] Starting database migration for user assessments...")

        try:
            engine = db.engine
            dialect_name = engine.dialect.name

            print(f"[Migration] Database dialect: {dialect_name}")

            # Create user_assessments table
            with engine.connect() as conn:
                try:
                    # SQL for creating user_assessments table
                    if dialect_name == 'sqlite':
                        create_table_sql = """
                        CREATE TABLE IF NOT EXISTS user_assessments (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id INTEGER NOT NULL,
                            assessment_content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                            UNIQUE(user_id)
                        )
                        """
                    elif dialect_name == 'postgresql':
                        create_table_sql = """
                        CREATE TABLE IF NOT EXISTS user_assessments (
                            id SERIAL PRIMARY KEY,
                            user_id INTEGER NOT NULL,
                            assessment_content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                            UNIQUE(user_id)
                        )
                        """
                    elif dialect_name == 'mysql':
                        create_table_sql = """
                        CREATE TABLE IF NOT EXISTS user_assessments (
                            id INTEGER PRIMARY KEY AUTO_INCREMENT,
                            user_id INTEGER NOT NULL,
                            assessment_content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                            UNIQUE(user_id)
                        )
                        """

                    conn.execute(text(create_table_sql))
                    conn.commit()
                    print("[Migration] ✓ Created 'user_assessments' table")

                    # Create index on user_id for faster lookups
                    try:
                        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_user_assessments_user_id ON user_assessments (user_id)"))
                        conn.commit()
                        print("[Migration] ✓ Created index on 'user_id'")
                    except Exception as e:
                        if 'already exists' in str(e).lower():
                            print("[Migration] ⊘ Index already exists, skipping")
                        else:
                            print(f"[Migration] ⚠ Could not create index: {str(e)}")

                except Exception as e:
                    if 'already exists' in str(e).lower():
                        print("[Migration] ⊘ Table 'user_assessments' already exists, skipping")
                    else:
                        raise

            print("[Migration] ✅ Migration completed successfully!")
            print("\n[Next Steps]")
            print("1. Restart your backend server")
            print("2. Test the user assessments feature from the frontend")

        except Exception as e:
            print(f"[Migration] ❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

if __name__ == '__main__':
    run_migration()
