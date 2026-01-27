from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from config import Config
from models import db, bcrypt
import os

# Import blueprints
from routes.main_routes import main_bp
from routes.auth_routes import auth_bp
from routes.interview_routes import interview_bp
from routes.chat_routes import chat_bp
from routes.admin_routes import admin_bp

# Import WebSocket init
from routes.websocket_routes import init_socketio_events

# Initialize SocketIO — allow specific origins later
socketio = SocketIO(
    async_mode="threading",
    logger=True,
    engineio_logger=True
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Build allowed origins list
    cors_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]

    FRONTEND_URL = os.getenv("FRONTEND_URL")
    if FRONTEND_URL:
        cors_origins.append(FRONTEND_URL.rstrip("/"))

    # Setup CORS for Flask HTTP routes
    CORS(
        app,
        resources={r"/*": {"origins": cors_origins}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        max_age=3600
    )

    print(f"[INFO] CORS allowed origins: {cors_origins}")

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)

    # Init SocketIO with allowed origins (needed for WebSocket handshakes)
    socketio.init_app(
        app,
        cors_allowed_origins=cors_origins
    )

    # **Important**: register WebSocket event handlers
    init_socketio_events(socketio)

    # Register HTTP blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(interview_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(admin_bp)

    # Create DB tables if not exist
    with app.app_context():
        db.create_all()
        print("[INFO] Database tables created")

    print("[INFO] TrueMirror backend started")
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port)
