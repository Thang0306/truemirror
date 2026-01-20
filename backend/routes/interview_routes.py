from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, InterviewSession, User
from datetime import datetime

interview_bp = Blueprint('interview', __name__, url_prefix='/api/interview')

@interview_bp.route('/setup', methods=['POST'])
@jwt_required()
def create_session():
    """
    Create new interview session
    """
    print("[START] Create interview session request")
    
    try:
        # Get current user (convert JWT identity back to int)
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            print(f"[WARN] User not found: {user_id}")
            return jsonify({'error': 'Người dùng không tồn tại'}), 404
        
        # Get request data
        data = request.get_json()
        position = data.get('position', '').strip()
        industry = data.get('industry', '').strip()
        style = data.get('style', '').strip()
        language = data.get('language', '').strip()
        
        # Validate input
        if not all([position, industry, style, language]):
            print("[WARN] Missing required fields")
            return jsonify({'error': 'Vui lòng điền đầy đủ thông tin'}), 400
        
        # Validate values
        valid_positions = ['Intern', 'Fresher', 'Junior', 'Manager']
        valid_industries = ['IT', 'Marketing', 'Sales', 'Finance', 'HR']
        valid_styles = ['Nghiêm túc', 'Thân thiện', 'Khó tính']
        valid_languages = ['vi', 'en']
        
        if position not in valid_positions:
            return jsonify({'error': 'Vị trí không hợp lệ'}), 400
        
        if industry not in valid_industries:
            return jsonify({'error': 'Ngành nghề không hợp lệ'}), 400
        
        if style not in valid_styles:
            return jsonify({'error': 'Phong cách không hợp lệ'}), 400
        
        if language not in valid_languages:
            return jsonify({'error': 'Ngôn ngữ không hợp lệ'}), 400
        
        # Create new interview session
        new_session = InterviewSession(
            user_id=user_id,
            position=position,
            industry=industry,
            style=style,
            language=language,
            status='pending'
        )
        
        db.session.add(new_session)
        db.session.commit()
        
        print(f"[SUCCESS] Interview session created: {new_session.id} for user {user.email}")
        
        return jsonify({
            'message': 'Tạo phiên phỏng vấn thành công',
            'session': new_session.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Create session failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi khi tạo phiên phỏng vấn'}), 500


@interview_bp.route('/sessions', methods=['GET'])
@jwt_required()
def get_user_sessions():
    """
    Get all interview sessions for current user
    """
    print("[START] Get user sessions request")

    try:
        # Convert JWT identity back to int
        user_id = int(get_jwt_identity())

        # Get all sessions for user
        sessions = InterviewSession.query.filter_by(user_id=user_id)\
            .order_by(InterviewSession.created_at.desc()).all()
        
        print(f"[SUCCESS] Found {len(sessions)} sessions for user {user_id}")
        
        return jsonify({
            'sessions': [session.to_dict() for session in sessions]
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Get sessions failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@interview_bp.route('/session/<int:session_id>', methods=['GET'])
@jwt_required()
def get_session(session_id):
    """
    Get specific interview session
    """
    print(f"[START] Get session request: {session_id}")

    try:
        # Convert JWT identity back to int
        user_id = int(get_jwt_identity())

        # Get session
        session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
        
        if not session:
            print(f"[WARN] Session not found: {session_id}")
            return jsonify({'error': 'Phiên phỏng vấn không tồn tại'}), 404
        
        print(f"[SUCCESS] Session retrieved: {session_id}")
        
        return jsonify({
            'session': session.to_dict()
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Get session failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500