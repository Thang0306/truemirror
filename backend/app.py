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
    allowed_origins = [
        "http://localhost:5173",  # Local dev
        "http://localhost:3000",
    ]
    
    # Add production frontend URL (will be set later)
    frontend_url = os.getenv('FRONTEND_URL')
    if frontend_url:
        allowed_origins.append(frontend_url)
        # Also allow all Vercel preview URLs
        allowed_origins.append("https://*.vercel.app")
    
    CORS(app, 
         resources={r"/api/*": {"origins": allowed_origins}},
         supports_credentials=True)
    
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