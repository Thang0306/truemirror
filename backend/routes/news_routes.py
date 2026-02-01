from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, NewsComment, User

news_bp = Blueprint('news', __name__, url_prefix='/api/news')

@news_bp.route('/<int:news_id>/comments', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_comments(news_id):
    """
    Get all comments for a news article
    """
    try:
        comments = NewsComment.query.filter_by(news_id=news_id).order_by(NewsComment.created_at.desc()).all()
        return jsonify({
            'success': True,
            'comments': [comment.to_dict() for comment in comments]
        }), 200
    except Exception as e:
        print(f"[ERROR] Get comments failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@news_bp.route('/<int:news_id>/comments', methods=['POST', 'OPTIONS'])
@cross_origin()
@jwt_required()
def create_comment(news_id):
    """
    Create a new comment on a news article
    Requires authentication
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get('content'):
            return jsonify({
                'success': False,
                'error': 'Content is required'
            }), 400

        # Validate news_id (1-6)
        if news_id < 1 or news_id > 6:
            return jsonify({
                'success': False,
                'error': 'Invalid news ID'
            }), 400

        comment = NewsComment(
            news_id=news_id,
            user_id=user_id,
            content=data['content'].strip()
        )

        db.session.add(comment)
        db.session.commit()

        return jsonify({
            'success': True,
            'comment': comment.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Create comment failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@news_bp.route('/<int:news_id>/comments/<int:comment_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin()
@jwt_required()
def delete_comment(news_id, comment_id):
    """
    Delete a comment
    Only the comment author can delete their comment
    """
    try:
        user_id = int(get_jwt_identity())

        comment = NewsComment.query.filter_by(id=comment_id, news_id=news_id).first()

        if not comment:
            return jsonify({
                'success': False,
                'error': 'Comment not found'
            }), 404

        # Check if user is the comment author
        if comment.user_id != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized to delete this comment'
            }), 403

        db.session.delete(comment)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Comment deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Delete comment failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
