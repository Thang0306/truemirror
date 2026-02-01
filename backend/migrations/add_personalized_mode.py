"""
Database migration script to add personalized interview mode support.

Run this script to update the interview_sessions table with new columns:
- mode: 'standard' or 'personalized'
- uploaded_files_info: JSON with extracted file information
- custom_questions: JSON with AI-generated questions
- position/industry: Now nullable for personalized mode

Usage:
    python backend/migrations/add_personalized_mode.py
"""

import sys
import os

# Add parent directory to path to import models
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import db
from app import create_app
from sqlalchemy import text

def run_migration():
    """Run the migration to add personalized mode columns."""
    app = create_app()

    with app.app_context():
        print("[Migration] Starting database migration for personalized interview mode...")

        try:
            # For SQLite, we need to handle column modifications differently
            # Check if we're using SQLite
            engine = db.engine
            dialect_name = engine.dialect.name

            print(f"[Migration] Database dialect: {dialect_name}")

            # Add new columns
            with engine.connect() as conn:
                # Add mode column with default 'standard'
                try:
                    conn.execute(text("ALTER TABLE interview_sessions ADD COLUMN mode VARCHAR(20) DEFAULT 'standard'"))
                    conn.commit()
                    print("[Migration] ✓ Added 'mode' column")
                except Exception as e:
                    if 'duplicate column name' in str(e).lower() or 'already exists' in str(e).lower():
                        print("[Migration] ⊘ 'mode' column already exists, skipping")
                    else:
                        raise

                # Add uploaded_files_info column
                try:
                    conn.execute(text("ALTER TABLE interview_sessions ADD COLUMN uploaded_files_info TEXT"))
                    conn.commit()
                    print("[Migration] ✓ Added 'uploaded_files_info' column")
                except Exception as e:
                    if 'duplicate column name' in str(e).lower() or 'already exists' in str(e).lower():
                        print("[Migration] ⊘ 'uploaded_files_info' column already exists, skipping")
                    else:
                        raise

                # Add custom_questions column
                try:
                    conn.execute(text("ALTER TABLE interview_sessions ADD COLUMN custom_questions TEXT"))
                    conn.commit()
                    print("[Migration] ✓ Added 'custom_questions' column")
                except Exception as e:
                    if 'duplicate column name' in str(e).lower() or 'already exists' in str(e).lower():
                        print("[Migration] ⊘ 'custom_questions' column already exists, skipping")
                    else:
                        raise

                # Note: SQLite doesn't support modifying columns to make them nullable
                # The application code will handle nullable position/industry
                # For production databases (PostgreSQL, MySQL), use appropriate ALTER commands

                if dialect_name != 'sqlite':
                    try:
                        conn.execute(text("ALTER TABLE interview_sessions MODIFY COLUMN position VARCHAR(50) NULL"))
                        conn.execute(text("ALTER TABLE interview_sessions MODIFY COLUMN industry VARCHAR(50) NULL"))
                        conn.commit()
                        print("[Migration] ✓ Modified 'position' and 'industry' to be nullable")
                    except Exception as e:
                        print(f"[Migration] ⚠ Could not modify position/industry to nullable: {str(e)}")
                else:
                    print("[Migration] ⊘ SQLite detected - position/industry nullability handled by application")

            print("[Migration] ✅ Migration completed successfully!")
            print("\n[Next Steps]")
            print("1. Install required packages: pip install -r backend/requirements.txt")
            print("2. Restart your backend server")
            print("3. Test the new personalized interview mode from the frontend")

        except Exception as e:
            print(f"[Migration] ❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

if __name__ == '__main__':
    run_migration()
