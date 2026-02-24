from .main_routes import main_bp
from .auth_routes import auth_bp
from .interview_routes import interview_bp
from .chat_routes import chat_bp
from .admin_routes import admin_bp
from .posts_routes import posts_bp
from .upload_routes import upload_bp

__all__ = ['main_bp', 'auth_bp', 'interview_bp', 'chat_bp', 'admin_bp', 'posts_bp', 'upload_bp']