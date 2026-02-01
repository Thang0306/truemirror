from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import db, InterviewSession, User
from datetime import datetime, timezone

interview_bp = Blueprint('interview', __name__, url_prefix='/api/interview')

@interview_bp.route('/setup', methods=['POST', 'OPTIONS'])
@cross_origin()
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
        valid_positions = ['Intern', 'Senior', 'Junior', 'Manager']
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


@interview_bp.route('/sessions', methods=['GET', 'OPTIONS'])
@cross_origin()
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


@interview_bp.route('/session/<int:session_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
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


@interview_bp.route('/history', methods=['GET', 'OPTIONS'])
@cross_origin()
@jwt_required()
def get_interview_history():
    """
    Get all interview sessions with conversations and evaluations for current user
    """
    print("[START] Get interview history request")
    
    try:
        from models import Conversation
        import json
        
        # Convert JWT identity back to int
        user_id = int(get_jwt_identity())
        
        # Get all completed sessions for user
        sessions = InterviewSession.query.filter_by(user_id=user_id)\
            .order_by(InterviewSession.created_at.desc()).all()
        
        # Build response with session info and conversations
        history = []
        for session in sessions:
            session_data = session.to_dict()
            
            # Get conversation for this session
            conversation = Conversation.query.filter_by(session_id=session.id).first()
            if conversation:
                messages = json.loads(conversation.messages_json)
                session_data['conversation'] = messages
            else:
                session_data['conversation'] = []
            
            history.append(session_data)
        
        print(f"[SUCCESS] Found {len(history)} sessions for user {user_id}")
        
        return jsonify({
            'history': history
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Get interview history failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@interview_bp.route('/history/assessment', methods=['GET', 'OPTIONS'])
@cross_origin()
@jwt_required()
def get_user_assessment():
    """
    Get user's most recent assessment from database
    """
    print("[START] Get user assessment request")

    try:
        from models.user_assessment import UserAssessment

        # Convert JWT identity back to int
        user_id = int(get_jwt_identity())

        # Get user's assessment
        assessment = UserAssessment.query.filter_by(user_id=user_id).first()

        if not assessment:
            print(f"[INFO] No assessment found for user {user_id}")
            return jsonify({
                'assessment': None
            }), 200

        print(f"[SUCCESS] Assessment retrieved for user {user_id}")

        return jsonify({
            'assessment': assessment.to_dict()
        }), 200

    except Exception as e:
        print(f"[ERROR] Get assessment failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi khi tải đánh giá'}), 500


@interview_bp.route('/history/generate-assessment', methods=['POST', 'OPTIONS'])
@cross_origin()
@jwt_required()
def generate_overall_assessment():
    """
    Generate overall assessment from all user's interview evaluations
    Saves to database, replacing old assessment if exists
    """
    print("[START] Generate overall assessment request")

    try:
        from services.azure_gpt_service import gpt_service
        from models.user_assessment import UserAssessment

        # Convert JWT identity back to int
        user_id = int(get_jwt_identity())

        # Get all completed sessions with evaluations
        sessions = InterviewSession.query.filter_by(user_id=user_id)\
            .filter(InterviewSession.evaluation.isnot(None))\
            .order_by(InterviewSession.created_at.desc()).all()

        if not sessions:
            return jsonify({
                'assessment': 'Bạn chưa có đánh giá phỏng vấn nào. Hãy hoàn thành ít nhất một buổi phỏng vấn và nhấn "Tổng kết phỏng vấn" để có đánh giá.'
            }), 200

        # Collect all evaluations
        evaluations = [session.evaluation for session in sessions if session.evaluation]

        # Generate overall assessment using GPT with temperature=0
        assessment_content = gpt_service.generate_overall_assessment(evaluations)

        # Save or update assessment in database
        existing_assessment = UserAssessment.query.filter_by(user_id=user_id).first()

        if existing_assessment:
            # Update existing assessment
            existing_assessment.assessment_content = assessment_content
            existing_assessment.updated_at = datetime.now(timezone.utc)
            print(f"[INFO] Updated existing assessment for user {user_id}")
        else:
            # Create new assessment
            new_assessment = UserAssessment(
                user_id=user_id,
                assessment_content=assessment_content
            )
            db.session.add(new_assessment)
            print(f"[INFO] Created new assessment for user {user_id}")

        db.session.commit()

        print(f"[SUCCESS] Generated and saved assessment for user {user_id} from {len(evaluations)} evaluations")

        # Return the saved assessment
        saved_assessment = UserAssessment.query.filter_by(user_id=user_id).first()

        return jsonify({
            'assessment': saved_assessment.to_dict(),
            'total_sessions': len(sessions)
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Generate overall assessment failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi khi tạo đánh giá tổng hợp'}), 500


@interview_bp.route('/history/<int:session_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
@jwt_required()
def get_session_detail(session_id):
    """
    Get detailed session with full conversation for read-only view
    """
    print(f"[START] Get session detail request: {session_id}")
    
    try:
        from models import Conversation
        import json
        
        # Convert JWT identity back to int
        user_id = int(get_jwt_identity())
        
        # Get session
        session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
        
        if not session:
            print(f"[WARN] Session not found: {session_id}")
            return jsonify({'error': 'Phiên phỏng vấn không tồn tại'}), 404
        
        session_data = session.to_dict()
        
        # Get conversation
        conversation = Conversation.query.filter_by(session_id=session_id).first()
        if conversation:
            messages = json.loads(conversation.messages_json)
            session_data['conversation'] = messages
        else:
            session_data['conversation'] = []
        
        print(f"[SUCCESS] Session detail retrieved: {session_id}")
        
        return jsonify({
            'session': session_data
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Get session detail failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@interview_bp.route('/setup/personalized', methods=['POST', 'OPTIONS'])
@cross_origin()
@jwt_required()
def create_personalized_session():
    """
    Create personalized interview session with file upload.
    Files are analyzed by AI to extract info and generate custom questions.
    """
    print("[START] Create personalized interview session request")

    try:
        import json
        from services.file_processor import file_processor
        from services.azure_gpt_service import gpt_service

        # Get current user
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            print(f"[WARN] User not found: {user_id}")
            return jsonify({'error': 'Người dùng không tồn tại'}), 404

        # Get form data
        style = request.form.get('style', '').strip()
        language = request.form.get('language', '').strip()

        # Validate required fields
        if not style or not language:
            print("[WARN] Missing required fields")
            return jsonify({'error': 'Vui lòng chọn phong cách và ngôn ngữ'}), 400

        # Validate values
        valid_styles = ['Nghiêm túc', 'Thân thiện', 'Khó tính']
        valid_languages = ['vi', 'en']

        if style not in valid_styles:
            return jsonify({'error': 'Phong cách không hợp lệ'}), 400

        if language not in valid_languages:
            return jsonify({'error': 'Ngôn ngữ không hợp lệ'}), 400

        # Get uploaded files
        files = request.files.getlist('files[]')

        if not files or len(files) == 0:
            return jsonify({'error': 'Vui lòng upload ít nhất 1 file'}), 400

        if len(files) > 4:
            return jsonify({'error': 'Tối đa 4 files được phép upload'}), 400

        print(f"[INFO] Processing {len(files)} uploaded files...")

        # Step 1: Process files (extract text or convert to base64)
        try:
            extracted_files = file_processor.process_multiple_files(files)
            print(f"[SUCCESS] Processed {len(extracted_files)} files")
        except Exception as e:
            print(f"[ERROR] File processing failed: {str(e)}")
            return jsonify({'error': f'Lỗi xử lý file: {str(e)}'}), 400

        # Step 2: Extract text from all files (using Vision API for images/PDFs)
        file_texts = []
        for file_data in extracted_files:
            try:
                if file_data['text']:
                    # Already extracted (TXT/DOCX)
                    file_texts.append(file_data['text'])
                elif file_data['base64_content']:
                    # Use Azure Vision API to extract text from image/PDF
                    extracted_text = gpt_service.extract_text_from_vision(
                        file_data['base64_content'],
                        file_data['filename']
                    )
                    file_texts.append(extracted_text)
            except Exception as e:
                print(f"[ERROR] Failed to extract text from {file_data['filename']}: {str(e)}")
                return jsonify({'error': f'Lỗi đọc file {file_data["filename"]}: {str(e)}'}), 400

        print(f"[SUCCESS] Extracted text from all {len(file_texts)} files")

        # Step 3: Analyze files with AI to extract info
        try:
            print("[INFO] Analyzing files with AI...")
            extracted_info = gpt_service.analyze_files_and_extract_info(file_texts, language)
            print(f"[SUCCESS] AI analysis complete: position={extracted_info.get('position')}, industry={extracted_info.get('industry')}")
        except Exception as e:
            print(f"[ERROR] AI analysis failed: {str(e)}")
            return jsonify({'error': f'Lỗi phân tích AI: {str(e)}'}), 500

        # Step 4: Generate personalized questions with AI
        try:
            print("[INFO] Generating personalized questions with AI...")
            custom_questions = gpt_service.generate_personalized_questions(
                extracted_info,
                style,
                language
            )
            print(f"[SUCCESS] Generated {len(custom_questions)} personalized questions")
        except Exception as e:
            print(f"[ERROR] Question generation failed: {str(e)}")
            return jsonify({'error': f'Lỗi tạo câu hỏi: {str(e)}'}), 500

        # Step 5: Create interview session
        try:
            new_session = InterviewSession(
                user_id=user_id,
                mode='personalized',
                position=extracted_info.get('position', 'N/A'),
                industry=extracted_info.get('industry', 'N/A'),
                style=style,
                language=language,
                uploaded_files_info=json.dumps(extracted_info, ensure_ascii=False),
                custom_questions=json.dumps(custom_questions, ensure_ascii=False),
                status='pending'
            )

            db.session.add(new_session)
            db.session.commit()

            print(f"[SUCCESS] Personalized interview session created: {new_session.id} for user {user.email}")

            return jsonify({
                'message': 'Tạo phiên phỏng vấn cá nhân hóa thành công',
                'session': new_session.to_dict()
            }), 201

        except Exception as e:
            db.session.rollback()
            print(f"[ERROR] Create session failed: {str(e)}")
            return jsonify({'error': 'Đã xảy ra lỗi khi tạo phiên phỏng vấn'}), 500

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Create personalized session failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Đã xảy ra lỗi: {str(e)}'}), 500