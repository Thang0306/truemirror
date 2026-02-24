from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Post, PostComment, User

posts_bp = Blueprint('posts', __name__, url_prefix='/api/posts')

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.email.lower() == 'admintruemirror@gmail.com'

@posts_bp.route('/', methods=['GET', 'OPTIONS'], strict_slashes=False)
@cross_origin()
def get_posts():
    """Get all posts (Hành trình phỏng vấn), ordered by newest first"""
    try:
        posts = Post.query.order_by(Post.created_at.desc()).all()
        return jsonify({
            'success': True,
            'posts': [post.to_dict() for post in posts]
        }), 200
    except Exception as e:
        print(f"[ERROR] Get posts failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@posts_bp.route('/<int:post_id>', methods=['GET', 'OPTIONS'], strict_slashes=False)
@cross_origin()
def get_post(post_id):
    """Get a single post by ID"""
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'success': False, 'error': 'Post not found'}), 404
        return jsonify({'success': True, 'post': post.to_dict()}), 200
    except Exception as e:
        print(f"[ERROR] Get post failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@posts_bp.route('/', methods=['POST', 'OPTIONS'], strict_slashes=False)
@cross_origin()
@jwt_required()
def create_post():
    """Create a new post - Admin only"""
    try:
        user_id = get_jwt_identity()
        if not is_admin(user_id):
            return jsonify({'success': False, 'error': 'Unauthorized. Admin only.'}), 403

        data = request.get_json()
        if not data or not data.get('title') or not data.get('content') or not data.get('date_display'):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        post = Post(
            title=data['title'].strip(),
            content=data['content'],
            image_url=data.get('image_url', ''),
            date_display=data['date_display'],
            user_id=user_id
        )
        db.session.add(post)
        db.session.commit()

        return jsonify({'success': True, 'post': post.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Create post failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@posts_bp.route('/<int:post_id>', methods=['DELETE', 'OPTIONS'], strict_slashes=False)
@cross_origin()
@jwt_required()
def delete_post(post_id):
    """Delete a post - Admin only"""
    try:
        user_id = get_jwt_identity()
        if not is_admin(user_id):
            return jsonify({'success': False, 'error': 'Unauthorized. Admin only.'}), 403

        post = Post.query.get(post_id)
        if not post:
            return jsonify({'success': False, 'error': 'Post not found'}), 404

        db.session.delete(post)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Post deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Delete post failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# --- Comments ---

@posts_bp.route('/<int:post_id>/comments', methods=['GET', 'OPTIONS'], strict_slashes=False)
@cross_origin()
def get_comments(post_id):
    """Get all comments for a post"""
    try:
        comments = PostComment.query.filter_by(post_id=post_id).order_by(PostComment.created_at.desc()).all()
        return jsonify({'success': True, 'comments': [c.to_dict() for c in comments]}), 200
    except Exception as e:
        print(f"[ERROR] Get comments failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@posts_bp.route('/<int:post_id>/comments', methods=['POST', 'OPTIONS'], strict_slashes=False)
@cross_origin()
@jwt_required()
def create_comment(post_id):
    """Create a comment on a post"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get('content'):
            return jsonify({'success': False, 'error': 'Content is required'}), 400

        post = Post.query.get(post_id)
        if not post:
            return jsonify({'success': False, 'error': 'Post not found'}), 404

        comment = PostComment(post_id=post_id, user_id=user_id, content=data['content'].strip())
        db.session.add(comment)
        db.session.commit()
        return jsonify({'success': True, 'comment': comment.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Create comment failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@posts_bp.route('/<int:post_id>/comments/<int:comment_id>', methods=['DELETE', 'OPTIONS'], strict_slashes=False)
@cross_origin()
@jwt_required()
def delete_comment(post_id, comment_id):
    """Delete a comment (only author)"""
    try:
        user_id = int(get_jwt_identity())
        comment = PostComment.query.filter_by(id=comment_id, post_id=post_id).first()

        if not comment:
            return jsonify({'success': False, 'error': 'Comment not found'}), 404
        if comment.user_id != user_id:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403

        db.session.delete(comment)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Comment deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Delete comment failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
