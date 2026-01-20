from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    # Primary fields
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    
    # Metadata fields
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        # Hash password using bcrypt
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        # Verify password against hash
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        # Convert user object to dictionary (exclude password)
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }