"""
Database migration script to add posts and posts_comments tables.

Run this script to create the posts and posts_comments tables.

Usage:
    python backend/migrations/add_posts.py
"""

import sys
import os

# Add parent directory to path to import models
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import db
from app import create_app
from sqlalchemy import text

def run_migration():
    """Run the migration to add posts and posts_comments tables."""
    app = create_app()

    with app.app_context():
        print("[Migration] Starting database migration for posts...")

        try:
            engine = db.engine
            dialect_name = engine.dialect.name

            print(f"[Migration] Database dialect: {dialect_name}")

            with engine.connect() as conn:
                try:
                    # Create posts table
                    create_posts_sql = """
                    CREATE TABLE IF NOT EXISTS posts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        content TEXT NOT NULL,
                        image_url TEXT,
                        date_display VARCHAR(100) NOT NULL,
                        user_id INTEGER NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                    )
                    """

                    if dialect_name == 'postgresql':
                        create_posts_sql = """
                        CREATE TABLE IF NOT EXISTS posts (
                            id SERIAL PRIMARY KEY,
                            title TEXT NOT NULL,
                            content TEXT NOT NULL,
                            image_url TEXT,
                            date_display VARCHAR(100) NOT NULL,
                            user_id INTEGER NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                        )
                        """
                    elif dialect_name == 'mysql':
                        create_posts_sql = """
                        CREATE TABLE IF NOT EXISTS posts (
                            id INTEGER PRIMARY KEY AUTO_INCREMENT,
                            title TEXT NOT NULL,
                            content TEXT NOT NULL,
                            image_url TEXT,
                            date_display VARCHAR(100) NOT NULL,
                            user_id INTEGER NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                        )
                        """

                    conn.execute(text(create_posts_sql))
                    conn.commit()
                    print("[Migration] ✓ Created 'posts' table")
                    
                    # Create posts_comments table
                    create_comments_sql = """
                    CREATE TABLE IF NOT EXISTS posts_comments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        post_id INTEGER NOT NULL,
                        user_id INTEGER NOT NULL,
                        content TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
                        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                    )
                    """

                    if dialect_name == 'postgresql':
                        create_comments_sql = """
                        CREATE TABLE IF NOT EXISTS posts_comments (
                            id SERIAL PRIMARY KEY,
                            post_id INTEGER NOT NULL,
                            user_id INTEGER NOT NULL,
                            content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                        )
                        """
                    elif dialect_name == 'mysql':
                        create_comments_sql = """
                        CREATE TABLE IF NOT EXISTS posts_comments (
                            id INTEGER PRIMARY KEY AUTO_INCREMENT,
                            post_id INTEGER NOT NULL,
                            user_id INTEGER NOT NULL,
                            content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
                            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                        )
                        """

                    conn.execute(text(create_comments_sql))
                    conn.commit()
                    print("[Migration] ✓ Created 'posts_comments' table")

                    # Create indexes
                    try:
                        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts (user_id)"))
                        conn.commit()
                        print("[Migration] ✓ Created index on 'posts.user_id'")
                    except Exception as e:
                        if 'already exists' in str(e).lower():
                            print("[Migration] ⊘ Index idx_posts_user_id already exists, skipping")
                        else:
                            print(f"[Migration] ⚠ Could not create index: {str(e)}")

                    try:
                        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_posts_comments_post_id ON posts_comments (post_id)"))
                        conn.commit()
                        print("[Migration] ✓ Created index on 'posts_comments.post_id'")
                    except Exception as e:
                        if 'already exists' in str(e).lower():
                            print("[Migration] ⊘ Index idx_posts_comments_post_id already exists, skipping")
                        else:
                            print(f"[Migration] ⚠ Could not create index: {str(e)}")

                except Exception as e:
                    if 'already exists' in str(e).lower():
                        print("[Migration] ⊘ Tables already exist, skipping")
                    else:
                        raise

            print("[Migration] ✅ Migration completed successfully!")
            print("\n[Next Steps]")
            print("1. Restart your backend server")
            print("2. Test the posts feature from the frontend")

        except Exception as e:
            print(f"[Migration] ❌ Migration failed: {str(e)}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

if __name__ == '__main__':
    run_migration()
