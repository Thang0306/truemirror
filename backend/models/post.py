from .user import db
from datetime import datetime

class Post(db.Model):
    """Model for posts (Hành trình phỏng vấn toàn diện)"""
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text, nullable=True)
    date_display = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    author = db.Relationship('User', backref=db.backref('posts', lazy=True, cascade="all, delete-orphan"))

    def to_dict(self):
        """Convert post to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'image_url': self.image_url,
            'date_display': self.date_display,
            'user_id': self.user_id,
            'author_name': self.author.full_name if getattr(self, 'author', None) else 'Admin',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
