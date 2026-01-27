from flask import Blueprint, jsonify
from flask_cors import cross_origin
import sys
from pathlib import Path

# Add data directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'data'))

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
