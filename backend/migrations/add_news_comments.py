"""
Database migration script to add news comments table.

Run this script to create the news_comments table for user comments on news articles.

Usage:
    python backend/migrations/add_news_comments.py
"""

import sys
import os

# Add parent directory to path to import models
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import db
from app import create_app
from sqlalchemy import text

def run_migration():
    """Run the migration to add news comments table."""
    app = create_app()

    with app.app_context():
        print("[Migration] Starting database migration for news comments...")

        try:
            engine = db.engine
            dialect_name = engine.dialect.name

            print(f"[Migration] Database dialect: {dialect_name}")

            # Create news_comments table
            with engine.connect() as conn:
                try:
                    # Create table if not exists
                    create_table_sql = """
                    CREATE TABLE IF NOT EXISTS news_comments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        news_id INTEGER NOT NULL,
                        user_id INTEGER NOT NULL,
                        content TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                    )
                    """

                    if dialect_name == 'postgresql':
                        create_table_sql = """
                        CREATE TABLE IF NOT EXISTS news_comments (
                            id SERIAL PRIMARY KEY,
                            news_id INTEGER NOT NULL,
                            user_id INTEGER NOT NULL,
                            content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                        )
                        """
                    elif dialect_name == 'mysql':
                        create_table_sql = """
                        CREATE TABLE IF NOT EXISTS news_comments (
                            id INTEGER PRIMARY KEY AUTO_INCREMENT,
                            news_id INTEGER NOT NULL,
                            user_id INTEGER NOT NULL,
                            content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                        )
                        """

                    conn.execute(text(create_table_sql))
                    conn.commit()
                    print("[Migration] ✓ Created 'news_comments' table")

                    # Create index on news_id for faster queries
                    try:
                        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_news_comments_news_id ON news_comments (news_id)"))
                        conn.commit()
                        print("[Migration] ✓ Created index on 'news_id'")
                    except Exception as e:
                        if 'already exists' in str(e).lower():
                            print("[Migration] ⊘ Index already exists, skipping")
                        else:
                            print(f"[Migration] ⚠ Could not create index: {str(e)}")

                except Exception as e:
                    if 'already exists' in str(e).lower():
                        print("[Migration] ⊘ Table 'news_comments' already exists, skipping")
                    else:
                        raise

            print("[Migration] ✅ Migration completed successfully!")
            print("\n[Next Steps]")
            print("1. Restart your backend server")
            print("2. Test the news comments feature from the frontend")

        except Exception as e:
            print(f"[Migration] ❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

if __name__ == '__main__':
    run_migration()
