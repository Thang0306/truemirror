import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'truemirror-dev-secret-key-2026')
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    # Azure OpenAI
    AZURE_OPENAI_KEY = os.getenv('AZURE_OPENAI_KEY')
    AZURE_OPENAI_BASE_URL = os.getenv('AZURE_OPENAI_BASE_URL')
    
    # CORS
    CORS_ORIGINS = ['http://localhost:5173', 'http://localhost:3000']
    
    # Database (SQLite for now)
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///truemirror.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False