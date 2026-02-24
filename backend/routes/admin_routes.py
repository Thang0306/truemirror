from flask import Blueprint, jsonify
from flask_cors import cross_origin
import sys
from pathlib import Path

# Add data and migrations directories to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'data'))
sys.path.insert(0, str(Path(__file__).parent.parent / 'migrations'))

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/seed-questions', methods=['POST', 'OPTIONS'])
@cross_origin()
def seed_questions_route():
    """
    Seed interview questions into database
    WARNING: This will clear existing question data!
    Usage: POST to /api/admin/seed-questions
    """
    try:
        print("[START] Seeding questions via API endpoint")

        # Import seed function inside route to avoid circular imports
        from seed_questions import main as seed_main

        # Run seeding
        seed_main()

        print("[SUCCESS] Questions seeded successfully")
        return jsonify({
            'success': True,
            'message': 'Database seeded successfully with interview questions'
        }), 200

    except Exception as e:
        print(f"[ERROR] Seed failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@admin_bp.route('/migrate-personalized-mode', methods=['POST', 'OPTIONS'])
@cross_origin()
def migrate_personalized_mode():
    """
    Run migration for personalized interview mode
    Adds: mode, uploaded_files_info, custom_questions columns
    Usage: POST to /api/admin/migrate-personalized-mode
    """
    try:
        print("[START] Running personalized mode migration via API endpoint")

        # Import migration function
        from add_personalized_mode import run_migration

        # Run migration
        run_migration()

        print("[SUCCESS] Personalized mode migration completed")
        return jsonify({
            'success': True,
            'message': 'Personalized mode migration completed successfully'
        }), 200

    except Exception as e:
        print(f"[ERROR] Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@admin_bp.route('/migrate-news-comments', methods=['POST', 'OPTIONS'])
@cross_origin()
def migrate_news_comments():
    """
    Run migration for news comments feature
    Creates: news_comments table
    Usage: POST to /api/admin/migrate-news-comments
    """
    try:
        print("[START] Running news comments migration via API endpoint")

        # Import migration function
        from add_news_comments import run_migration

        # Run migration
        run_migration()

        print("[SUCCESS] News comments migration completed")
        return jsonify({
            'success': True,
            'message': 'News comments migration completed successfully'
        }), 200

    except Exception as e:
        print(f"[ERROR] Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@admin_bp.route('/migrate-user-assessments', methods=['POST', 'OPTIONS'])
@cross_origin()
def migrate_user_assessments():
    """
    Run migration for user assessments feature
    Creates: user_assessments table
    Usage: POST to /api/admin/migrate-user-assessments
    """
    try:
        print("[START] Running user assessments migration via API endpoint")

        # Import migration function
        from add_user_assessments import run_migration

        # Run migration
        run_migration()

        print("[SUCCESS] User assessments migration completed")
        return jsonify({
            'success': True,
            'message': 'User assessments migration completed successfully'
        }), 200

    except Exception as e:
        print(f"[ERROR] Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@admin_bp.route('/migrate-posts', methods=['POST', 'OPTIONS'])
@cross_origin()
def migrate_posts():
    """
    Run migration for posts feature
    Creates: posts, posts_comments tables
    Usage: POST to /api/admin/migrate-posts
    """
    try:
        print("[START] Running posts migration via API endpoint")

        # Import migration function
        from add_posts import run_migration

        # Run migration
        run_migration()

        print("[SUCCESS] Posts migration completed")
        return jsonify({
            'success': True,
            'message': 'Posts migration completed successfully'
        }), 200

    except Exception as e:
        print(f"[ERROR] Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@admin_bp.route('/migrate-all', methods=['POST', 'OPTIONS'])
@cross_origin()
def migrate_all():
    """
    Run all migrations in sequence
    1. Personalized interview mode
    2. News comments
    3. User assessments
    4. Posts
    Usage: POST to /api/admin/migrate-all
    """
    try:
        print("[START] Running all migrations via API endpoint")
        results = []

        # Migration 1: Personalized Mode
        try:
            from add_personalized_mode import run_migration as migrate_personalized
            migrate_personalized()
            results.append('✓ Personalized mode migration completed')
        except Exception as e:
            results.append(f'✗ Personalized mode migration failed: {str(e)}')

        # Migration 2: News Comments
        try:
            from add_news_comments import run_migration as migrate_news
            migrate_news()
            results.append('✓ News comments migration completed')
        except Exception as e:
            results.append(f'✗ News comments migration failed: {str(e)}')

        # Migration 3: User Assessments
        try:
            from add_user_assessments import run_migration as migrate_assessments
            migrate_assessments()
            results.append('✓ User assessments migration completed')
        except Exception as e:
            results.append(f'✗ User assessments migration failed: {str(e)}')

        # Migration 4: Posts
        try:
            from add_posts import run_migration as migrate_posts_func
            migrate_posts_func()
            results.append('✓ Posts migration completed')
        except Exception as e:
            results.append(f'✗ Posts migration failed: {str(e)}')

        print("[SUCCESS] All migrations completed")
        return jsonify({
            'success': True,
            'message': 'All migrations completed',
            'results': results
        }), 200

    except Exception as e:
        print(f"[ERROR] Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
