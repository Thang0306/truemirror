from flask import Blueprint, jsonify

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/seed-questions', methods=['POST', 'OPTIONS'])
def seed_questions_route():
    """
    Seed interview questions into database
    WARNING: This will clear existing question data!
    Usage: POST to /api/admin/seed-questions

    Note: Seeding is resource-intensive and may take 30-60 seconds.
    This endpoint should only be called once during initial setup.
    """
    try:
        print("[START] Seeding questions via API endpoint")

        # Import inside function to avoid circular imports and slow module loading
        import sys
        from pathlib import Path

        # Add data directory to path
        data_dir = Path(__file__).parent.parent / 'data'
        if str(data_dir) not in sys.path:
            sys.path.insert(0, str(data_dir))

        # Import and run seed function
        from seed_questions import main as seed_main
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
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@admin_bp.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'admin'}), 200
