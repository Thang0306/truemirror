from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db, bcrypt
from routes import main_bp, auth_bp, interview_bp
import os

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # CORS configuration for production
    # Allow both localhost and production URLs
    cors_origins = [
        "http://localhost:5173",  # Local Vite dev
        "http://localhost:3000",  # Local alternative
    ]

    # Add Vercel frontend URL from environment
    frontend_url = os.getenv('FRONTEND_URL')
    if frontend_url:
        # Remove trailing slash if exists
        frontend_url = frontend_url.rstrip('/')
        cors_origins.append(frontend_url)

    # TEMPORARY: Allow all origins for testing
    # TODO: Restrict to specific origins in production
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    print(f"[INFO] CORS: Allowing ALL origins (development/testing mode)")
    print(f"[INFO] Configured origins list: {cors_origins}")
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(interview_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
        print("[INFO] Database tables created")
    
    print("[INFO] TrueMirror backend started successfully")
    print(f"[INFO] Environment: {os.getenv('RAILWAY_ENVIRONMENT', 'development')}")
    
    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)