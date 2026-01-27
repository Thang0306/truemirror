from flask import Blueprint, request, jsonify, Response, stream_with_context
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, InterviewSession, Conversation
from services.azure_gpt_service import AzureGPTService
from datetime import datetime, timezone
import json

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')
gpt_service = AzureGPTService()

# In-memory cache for conversation history
conversation_cache = {}

def get_conversation_history(session_id):
    """Get conversation history from cache or database"""
    if session_id in conversation_cache:
        return conversation_cache[session_id]

    # Load from database
    conversation = Conversation.query.filter_by(session_id=session_id).first()
    if conversation:
        messages = json.loads(conversation.messages_json)
        conversation_cache[session_id] = messages
        return messages

    return []

def update_conversation_history(session_id, messages):
    """Update conversation history in cache and database"""
    conversation_cache[session_id] = messages

    # Update database
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


@chat_bp.route('/message/stream', methods=['POST'])
@jwt_required()
def send_message_stream():
    """
    Send message and get streaming response
    """
    print("[START] Chat stream request")

    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        session_id = data.get('session_id')
        message = data.get('message', '').strip()

        if not session_id or not message:
            return jsonify({'error': 'Session ID và message là bắt buộc'}), 400

        # Verify session belongs to user
        session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
        if not session:
            return jsonify({'error': 'Phiên phỏng vấn không tồn tại'}), 404

        # Update session status to in_progress if pending
        if session.status == 'pending':
            session.status = 'in_progress'
            session.started_at = datetime.now(timezone.utc)
            db.session.commit()

        # Get conversation history
        conversation_history = get_conversation_history(session_id)

        # If this is first message, add system prompt
        if len(conversation_history) == 0:
            system_prompt = gpt_service.build_interview_system_prompt(
                session.position,
                session.industry,
                session.style,
                session.language
            )
            conversation_history.append({
                'role': 'system',
                'content': system_prompt,
                'timestamp': datetime.now(timezone.utc).isoformat()
            })

        # Add user message
        conversation_history.append({
            'role': 'user',
            'content': message,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })

        # Prepare messages for API (only role and content)
        api_messages = [{'role': msg['role'], 'content': msg['content']} for msg in conversation_history]

        # Generate streaming response
        def generate():
            full_response = ""
            try:
                for chunk in gpt_service.get_chat_response_stream(api_messages):
                    if chunk:
                        full_response += chunk
                        yield f"data: {json.dumps({'chunk': chunk, 'done': False}, ensure_ascii=False)}\n\n"

                # Add assistant message to history
                timestamp = datetime.now(timezone.utc).isoformat()
                conversation_history.append({
                    'role': 'assistant',
                    'content': full_response,
                    'timestamp': timestamp
                })

                # Save to database
                update_conversation_history(session_id, conversation_history)

                # Signal completion
                yield f"data: {json.dumps({'chunk': '', 'done': True, 'timestamp': timestamp}, ensure_ascii=False)}\n\n"

                print(f"[SUCCESS] Chat message sent for session {session_id}")

            except Exception as e:
                print(f"[ERROR] Stream generation failed: {str(e)}")
                yield f"data: {json.dumps({'error': str(e), 'done': True}, ensure_ascii=False)}\n\n"

        return Response(stream_with_context(generate()), mimetype='text/event-stream')

    except Exception as e:
        print(f"[ERROR] Chat stream failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@chat_bp.route('/history/<int:session_id>', methods=['GET'])
@jwt_required()
def get_history(session_id):
    """Get conversation history for a session"""
    print(f"[START] Get chat history for session {session_id}")

    try:
        user_id = int(get_jwt_identity())

        # Verify session belongs to user
        session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
        if not session:
            return jsonify({'error': 'Phiên phỏng vấn không tồn tại'}), 404

        # Get history
        history = get_conversation_history(session_id)

        # Filter out system messages for frontend
        user_messages = [msg for msg in history if msg['role'] != 'system']

        return jsonify({
            'history': user_messages,
            'session': session.to_dict()
        }), 200

    except Exception as e:
        print(f"[ERROR] Get history failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500


@chat_bp.route('/end/<int:session_id>', methods=['POST'])
@jwt_required()
def end_session(session_id):
    """End interview session"""
    print(f"[START] End session {session_id}")

    try:
        user_id = int(get_jwt_identity())

        # Verify session belongs to user
        session = InterviewSession.query.filter_by(id=session_id, user_id=user_id).first()
        if not session:
            return jsonify({'error': 'Phiên phỏng vấn không tồn tại'}), 404

        # Update session status
        session.status = 'completed'
        session.completed_at = datetime.now(timezone.utc)
        db.session.commit()

        # Clear from cache
        if session_id in conversation_cache:
            del conversation_cache[session_id]

        print(f"[SUCCESS] Session {session_id} ended")

        return jsonify({
            'message': 'Phiên phỏng vấn đã kết thúc',
            'session': session.to_dict()
        }), 200

    except Exception as e:
        print(f"[ERROR] End session failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500
