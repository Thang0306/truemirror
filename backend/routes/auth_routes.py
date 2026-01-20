from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import db, User
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Email validation regex
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register new user endpoint (mock - no email sending)
    """
    print("[START] Register request received")
    
    try:
        # Get request data
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        
        # Validate input
        if not email or not password or not full_name:
            print("[WARN] Missing required fields")
            return jsonify({'error': 'Email, mật khẩu và họ tên là bắt buộc'}), 400
        
        # Validate email format
        if not EMAIL_REGEX.match(email):
            print(f"[WARN] Invalid email format: {email}")
            return jsonify({'error': 'Email không hợp lệ'}), 400
        
        # Validate password length
        if len(password) < 6:
            print("[WARN] Password too short")
            return jsonify({'error': 'Mật khẩu phải có ít nhất 6 ký tự'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            print(f"[WARN] User already exists: {email}")
            return jsonify({'error': 'Email đã được đăng ký'}), 409
        
        # Create new user
        new_user = User(
            email=email,
            full_name=full_name
        )
        new_user.set_password(password)
        
        # Save to database
        db.session.add(new_user)
        db.session.commit()
        
        print(f"[SUCCESS] User registered: {email}")

        # Create JWT token (identity must be string)
        access_token = create_access_token(identity=str(new_user.id))
        
        return jsonify({
            'message': 'Đăng ký thành công',
            'user': new_user.to_dict(),
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Register failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi khi đăng ký'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login endpoint with JWT token
    """
    print("[START] Login request received")
    
    try:
        # Get request data
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validate input
        if not email or not password:
            print("[WARN] Missing email or password")
            return jsonify({'error': 'Email và mật khẩu là bắt buộc'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            print(f"[WARN] User not found: {email}")
            return jsonify({'error': 'Email hoặc mật khẩu không đúng'}), 401
        
        # Check if user is active
        if not user.is_active:
            print(f"[WARN] Inactive user attempted login: {email}")
            return jsonify({'error': 'Tài khoản đã bị vô hiệu hóa'}), 403
        
        # Verify password
        if not user.check_password(password):
            print(f"[WARN] Invalid password for user: {email}")
            return jsonify({'error': 'Email hoặc mật khẩu không đúng'}), 401
        
        # Create JWT token (identity must be string)
        access_token = create_access_token(identity=str(user.id))

        print(f"[SUCCESS] User logged in: {email}")
        
        return jsonify({
            'message': 'Đăng nhập thành công',
            'user': user.to_dict(),
            'access_token': access_token
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Login failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi khi đăng nhập'}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current logged in user info
    """
    print("[START] Get current user request")
    
    try:
        # Get user ID from JWT token (convert back to int)
        user_id = int(get_jwt_identity())

        # Find user
        user = User.query.get(user_id)
        
        if not user:
            print(f"[WARN] User not found: {user_id}")
            return jsonify({'error': 'Người dùng không tồn tại'}), 404
        
        print(f"[SUCCESS] User info retrieved: {user.email}")
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Get current user failed: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi'}), 500