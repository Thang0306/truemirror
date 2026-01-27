"""
WebSocket routes for real-time interview chat with AI.
Replaces SSE with WebSocket for better support of future voice features.
"""

from flask import request
from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import decode_token
from models import db, InterviewSession, Conversation, InterviewQuestion, QuestionSection, Position, Industry, JobLevel
from services.azure_gpt_service import AzureGPTService
import json
from datetime import datetime, timezone

# Initialize service
gpt_service = AzureGPTService()

# In-memory cache for active conversations
conversation_cache = {}

# Track current question index for each session
session_question_state = {}

def init_socketio_events(socketio):
    """Initialize SocketIO event handlers."""

    @socketio.on('connect')
    def handle_connect():
        """Handle client connection."""
        print(f"[WebSocket] Client connected: {request.sid}")
        emit('connection_response', {'status': 'connected', 'message': 'Connected to TrueMirror interview server'})

    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnection."""
        print(f"[WebSocket] Client disconnected: {request.sid}")

    @socketio.on('join_session')
    def handle_join_session(data):
        """Join interview session room."""
        try:
            session_id = data.get('session_id')
            token = data.get('token')

            if not session_id or not token:
                emit('error', {'message': 'Missing session_id or token'})
                return

            # Verify JWT token
            try:
                decoded = decode_token(token)
                user_id = int(decoded['sub'])  # Convert string to int for comparison
            except Exception as e:
                emit('error', {'message': f'Invalid token: {str(e)}'})
                return

            # Verify session exists and belongs to user
            session = InterviewSession.query.get(session_id)
            if not session:
                emit('error', {'message': 'Session not found'})
                return

            if session.user_id != user_id:
                emit('error', {'message': 'Unauthorized access to session'})
                return

            # Join room
            room = f"session_{session_id}"
            join_room(room)

            # Load conversation history
            conversation_history = get_conversation_history(session_id)

            # Initialize question state if not exists
            if session_id not in session_question_state:
                session_question_state[session_id] = {
                    'current_question_index': 0,
                    'current_section': 1,
                    'questions_asked': [],
                    'awaiting_answer': False,
                    'popup_mode': False
                }

            emit('joined_session', {
                'session_id': session_id,
                'room': room,
                'conversation_history': conversation_history,
                'message': 'Đã tham gia phòng phỏng vấn'
            })

            print(f"[WebSocket] User {user_id} joined session {session_id}")

        except Exception as e:
            print(f"[ERROR] Join session failed: {str(e)}")
            emit('error', {'message': f'Failed to join session: {str(e)}'})

    @socketio.on('send_message')
    def handle_send_message(data):
        """Handle user message and get AI response with streaming."""
        try:
            session_id = data.get('session_id')
            message = data.get('message', '').strip()
            token = data.get('token')

            if not session_id or not message or not token:
                emit('error', {'message': 'Missing required fields'})
                return

            # Verify token and session
            try:
                decoded = decode_token(token)
                user_id = int(decoded['sub'])  # Convert string to int for comparison
            except Exception as e:
                emit('error', {'message': f'Invalid token: {str(e)}'})
                return

            session = InterviewSession.query.get(session_id)
            if not session or session.user_id != user_id:
                emit('error', {'message': 'Unauthorized'})
                return

            # Update session status
            if session.status == 'pending':
                session.status = 'in_progress'
                db.session.commit()

            # Get conversation history
            conversation_history = get_conversation_history(session_id)

            # Add user message
            timestamp = datetime.now(timezone.utc).isoformat()
            user_message = {
                'role': 'user',
                'content': message,
                'timestamp': timestamp
            }
            conversation_history.append(user_message)
            conversation_cache[session_id] = conversation_history

            # Emit user message to room
            room = f"session_{session_id}"
            emit('user_message', user_message, room=room)

            # Build messages for AI (include system prompt if first message)
            api_messages = build_api_messages(session, conversation_history)

            # Stream AI response
            emit('ai_typing', {'typing': True}, room=room)

            full_response = ""
            import time
            for chunk in gpt_service.get_chat_response_stream(api_messages):
                if chunk:
                    full_response += chunk
                    emit('ai_chunk', {'chunk': chunk}, room=room)
                    # Add small delay for smoother streaming effect
                    time.sleep(0.02)  # 20ms delay between chunks

            # Add AI response to history
            ai_timestamp = datetime.now(timezone.utc).isoformat()
            ai_message = {
                'role': 'assistant',
                'content': full_response,
                'timestamp': ai_timestamp
            }
            conversation_history.append(ai_message)
            conversation_cache[session_id] = conversation_history

            # Save to database
            save_conversation(session_id, conversation_history)

            # Emit completion
            emit('ai_typing', {'typing': False}, room=room)
            emit('ai_complete', {
                'message': ai_message,
                'timestamp': ai_timestamp
            }, room=room)

            # Check if should ask next question automatically
            handle_question_flow(session_id, full_response, room)

        except Exception as e:
            print(f"[ERROR] Send message failed: {str(e)}")
            import traceback
            traceback.print_exc()
            emit('error', {'message': f'Failed to send message: {str(e)}'})

    @socketio.on('end_session')
    def handle_end_session(data):
        """End interview session and navigate away."""
        try:
            session_id = data.get('session_id')
            token = data.get('token')

            if not session_id or not token:
                emit('error', {'message': 'Missing session_id or token'})
                return

            # Verify token
            try:
                decoded = decode_token(token)
                user_id = int(decoded['sub'])
            except Exception as e:
                emit('error', {'message': f'Invalid token: {str(e)}'})
                return

            # Update session status
            session = InterviewSession.query.get(session_id)
            if session and session.user_id == user_id:
                session.status = 'completed'
                db.session.commit()

                # Clear cache
                if session_id in conversation_cache:
                    del conversation_cache[session_id]
                if session_id in session_question_state:
                    del session_question_state[session_id]

                room = f"session_{session_id}"
                emit('session_ended', {
                    'session_id': session_id,
                    'status': 'completed'
                }, room=room)

                leave_room(room)
                print(f"[WebSocket] Session {session_id} ended")

        except Exception as e:
            print(f"[ERROR] End session failed: {str(e)}")
            emit('error', {'message': f'Failed to end session: {str(e)}'})

    @socketio.on('evaluate_session')
    def handle_evaluate_session(data):
        """Evaluate interview session and show results."""
        try:
            session_id = data.get('session_id')
            token = data.get('token')

            if not session_id or not token:
                emit('error', {'message': 'Missing session_id or token'})
                return

            # Verify token
            try:
                decoded = decode_token(token)
                user_id = int(decoded['sub'])
            except Exception as e:
                emit('error', {'message': f'Invalid token: {str(e)}'})
                return

            # Verify session
            session = InterviewSession.query.get(session_id)
            if not session or session.user_id != user_id:
                emit('error', {'message': 'Unauthorized'})
                return

            # Generate evaluation summary
            conversation_history = get_conversation_history(session_id)
            evaluation = generate_final_evaluation(session_id, conversation_history)

            room = f"session_{session_id}"
            emit('session_evaluated', {
                'session_id': session_id,
                'evaluation': evaluation
            }, room=room)

            print(f"[WebSocket] Session {session_id} evaluated")

        except Exception as e:
            print(f"[ERROR] Evaluate session failed: {str(e)}")
            emit('error', {'message': f'Failed to evaluate session: {str(e)}'})

def get_conversation_history(session_id):
    """Get conversation history from cache or database."""
    if session_id in conversation_cache:
        return conversation_cache[session_id]

    conversation = Conversation.query.filter_by(session_id=session_id).first()
    if conversation:
        messages = json.loads(conversation.messages_json)
        conversation_cache[session_id] = messages
        return messages

    return []

def save_conversation(session_id, messages):
    """Save conversation to database."""
    conversation = Conversation.query.filter_by(session_id=session_id).first()

    if conversation:
        conversation.messages_json = json.dumps(messages, ensure_ascii=False)
        conversation.updated_at = datetime.now(timezone.utc)
    else:
        conversation = Conversation(
            session_id=session_id,
            messages_json=json.dumps(messages, ensure_ascii=False)
        )
        db.session.add(conversation)

    db.session.commit()

def build_api_messages(session, conversation_history):
    """Build messages array for AI API, including system prompt."""
    api_messages = []

    # Check if we need to add system prompt (first message)
    has_system_prompt = any(msg.get('role') == 'system' for msg in conversation_history)

    if not has_system_prompt:
        # Build system prompt based on session config
        system_prompt = gpt_service.build_interview_system_prompt(
            position=session.position,
            industry=session.industry,
            style=session.style,
            language=session.language
        )

        # Add questions context from database
        questions_context = get_questions_for_session(session)
        if questions_context:
            system_prompt += f"\n\n{questions_context}"

        api_messages.append({
            'role': 'system',
            'content': system_prompt
        })

    # Add conversation history (skip system messages)
    for msg in conversation_history:
        if msg.get('role') != 'system':
            api_messages.append({
                'role': msg['role'],
                'content': msg['content']
            })

    return api_messages

def get_questions_for_session(session):
    """Get interview questions from database for the session."""
    try:
        # Map job level and industry
        job_level_map = {
            'Intern': 'intern',
            'Junior': 'junior',
            'Senior': 'senior',
            'Manager': 'manager'
        }

        industry_map = {
            'IT': 'it',
            'Marketing': 'marketing',
            'Sales': 'sales',
            'Finance': 'finance',
            'HR': 'hr'
        }

        # Find position with matching job level and industry
        position = Position.query.join(Position.industry).join(Position.job_level).filter(
            db.func.lower(Industry.name) == industry_map.get(session.industry, session.industry.lower()),
            db.func.lower(JobLevel.name) == job_level_map.get(session.position, session.position.lower())
        ).first()

        if not position:
            return None

        # Get all sections and questions for this position
        sections = QuestionSection.query.filter_by(position_id=position.id).order_by(QuestionSection.section_number).all()

        if not sections:
            return None

        # Build structured questions context
        context = "=== INTERVIEW QUESTIONS STRUCTURE ===\n\n"
        context += f"Position: {position.name}\n"
        context += f"Total Duration: {position.total_duration_minutes} minutes\n"
        context += f"Language: {'Tiếng Việt' if position.language == 'vi' else 'English'}\n\n"

        for section in sections:
            context += f"SECTION {section.section_number}: {section.section_name}\n"
            context += f"Duration: {section.duration_minutes} minutes\n\n"

            questions = InterviewQuestion.query.filter_by(section_id=section.id).order_by(InterviewQuestion.question_number).all()

            for q in questions:
                context += f"Question {q.question_number}: {q.question_text}\n"
                context += f"Type: {q.question_type_text}\n"
                context += f"Pressure: {q.pressure_level_text}\n"
                context += f"Purpose: {q.purpose}\n"
                context += f"Expected Duration: {q.expected_duration_minutes} min\n"

                # Add popup questions
                if q.popup_questions:
                    context += "POP-UP follow-ups:\n"
                    for popup in q.popup_questions:
                        context += f"  - {popup.popup_text}\n"

                # Add guidelines
                must_have = [g.content for g in q.guidelines if g.guideline_type == 'must_have']
                should_avoid = [g.content for g in q.guidelines if g.guideline_type == 'should_avoid']

                if must_have:
                    context += "Must have in answer:\n"
                    for item in must_have:
                        context += f"  ✓ {item}\n"

                if should_avoid:
                    context += "Should avoid:\n"
                    for item in should_avoid:
                        context += f"  ✗ {item}\n"

                context += "\n"

        return context

    except Exception as e:
        print(f"[ERROR] Failed to get questions: {str(e)}")
        return None

def handle_question_flow(session_id, ai_response, room):
    """Handle intelligent question flow after AI response."""
    # This will be enhanced later to track which questions have been asked
    # and automatically move to next question when appropriate
    pass

def generate_final_evaluation(session_id, conversation_history):
    """Generate comprehensive evaluation at end of interview."""
    try:
        # Build evaluation prompt
        eval_prompt = """
Dựa trên cuộc phỏng vấn vừa rồi, hãy tạo đánh giá tổng kết chi tiết theo định dạng markdown **chặt chẽ**.   
Yêu cầu kết quả gồm đúng 4 phần sau với nội dung rõ ràng:
### 1. ĐIỂM MẠNH (Strengths)
Liệt kê 3–5 điểm mạnh nổi bật của ứng viên. Mỗi điểm bắt đầu bằng "- ".
### 2. ĐIỂM CẦN PHÁT TRIỂN (Areas for Improvement)
Liệt kê 2–4 điểm cần cải thiện. Mỗi điểm bắt đầu bằng "- ".
### 3. ĐÁNH GIÁ TỔNG QUAN (Overall Assessment)
Viết 1–2 đoạn ngắn gọn, dễ đọc về tổng quan hiệu suất và gợi ý cho lần phỏng vấn tiếp theo. Không dùng list trong phần này.
### 4. ĐIỂM SỐ (Score)
Cho điểm theo thang X/10, ghi rõ ở đầu dòng dạng "**Score: X/10**".

**Luôn giữ đúng markdown format với các tiêu đề và dấu đầu dòng như trên.** Viết ngắn gọn, cụ thể, tránh lặp lại.
"""

        messages = []
        for msg in conversation_history:
            if msg.get('role') != 'system':
                messages.append({
                    'role': msg['role'],
                    'content': msg['content']
                })

        messages.append({
            'role': 'user',
            'content': eval_prompt
        })

        # Get evaluation from AI (non-streaming)
        evaluation = ""
        for chunk in gpt_service.get_chat_response_stream(messages):
            evaluation += chunk

        return evaluation

    except Exception as e:
        print(f"[ERROR] Evaluation generation failed: {str(e)}")
        return "Không thể tạo đánh giá tự động. Vui lòng liên hệ admin."