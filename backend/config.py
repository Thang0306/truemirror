import os
from datetime import timedelta

class Config:
    # Flask config
    SECRET_KEY = os.getenv('SECRET_KEY', 'truemirror-secret-key-dev-2026')
    
    # Database config - Support both SQLite (dev) and PostgreSQL (prod)
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///truemirror.db')
    
    # Fix Railway PostgreSQL URL format
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT config
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'truemirror-jwt-secret-dev-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Azure OpenAI config
    AZURE_OPENAI_KEY = os.getenv('AZURE_OPENAI_KEY', '')
    AZURE_OPENAI_ENDPOINT = os.getenv('AZURE_OPENAI_ENDPOINT', '')
    AZURE_OPENAI_DEPLOYMENT = os.getenv('AZURE_OPENAI_DEPLOYMENT', 'gpt-4')