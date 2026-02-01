from .user import db
from datetime import datetime

class NewsComment(db.Model):
    """Model for news article comments"""
    __tablename__ = 'news_comments'

    id = db.Column(db.Integer, primary_key=True)
    news_id = db.Column(db.Integer, nullable=False, index=True)  # Reference to news article ID (1-6)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.Relationship('User', backref=db.backref('news_comments', lazy=True))

    def to_dict(self):
        """Convert comment to dictionary"""
        return {
            'id': self.id,
            'news_id': self.news_id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else 'Unknown',
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
