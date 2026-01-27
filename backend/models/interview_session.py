from datetime import datetime, timezone
from .user import db

class InterviewSession(db.Model):
    __tablename__ = 'interview_sessions'
    
    # Primary fields
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Interview configuration
    position = db.Column(db.String(50), nullable=False)  # Intern, Senior, Junior, Manager
    industry = db.Column(db.String(50), nullable=False)  # IT, Marketing, Sales, Finance, HR
    style = db.Column(db.String(50), nullable=False)     # Nghiêm túc, Thân thiện, Khó tính
    language = db.Column(db.String(20), nullable=False)  # vi, en
    
    # Session metadata
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('interview_sessions', lazy=True))
    
    def __repr__(self):
        return f'<InterviewSession {self.id} - User {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'position': self.position,
            'industry': self.industry,
            'style': self.style,
            'language': self.language,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }