from flask import Blueprint, jsonify

main_bp = Blueprint("main_bp", __name__)

@main_bp.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint for Railway."""
    return jsonify({
        "status": "healthy",
        "message": "TrueMirror API is running"
    }), 200

@main_bp.route("/api/info", methods=["GET"])
def get_info():
    """Basic info endpoint."""
    return jsonify({
        "app": "TrueMirror",
        "version": "1.0.0",
        "description": "AI-powered interview practice platform"
    }), 200
