from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
import cloudinary
import cloudinary.uploader
import os
from models import User

# Configure Cloudinary credentials from env
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'dxn93x7kw'),
    api_key=os.getenv('CLOUDINARY_API_KEY', '113785113419524'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'tbBc8qkIGba441ilYdeqYamJszw')
)

upload_bp = Blueprint('upload', __name__, url_prefix='/api/upload')

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.email.lower() == 'admintruemirror@gmail.com'

@upload_bp.route('', methods=['POST', 'OPTIONS'], strict_slashes=False)
@upload_bp.route('/', methods=['POST', 'OPTIONS'], strict_slashes=False)
@cross_origin()
@jwt_required()
def upload_image():
    """Upload image to Cloudinary (Admin only)"""
    try:
        user_id = get_jwt_identity()
        if not is_admin(user_id):
            return jsonify({'success': False, 'error': 'Unauthorized. Admin only.'}), 403

        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file part'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No selected file'}), 400

        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            file,
            folder='truemirror_posts'
        )

        return jsonify({
            'success': True,
            'url': upload_result.get('secure_url'),
            'location': upload_result.get('secure_url') # for TinyMCE compatibility
        }), 200

    except Exception as e:
        print(f"[ERROR] Upload to Cloudinary failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
