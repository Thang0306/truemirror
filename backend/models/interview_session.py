from datetime import datetime, timezone
from .user import db

class InterviewSession(db.Model):
    __tablename__ = 'interview_sessions'
    
    # Primary fields
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Interview configuration
    mode = db.Column(db.String(20), default='standard')  # standard, personalized
    position = db.Column(db.String(50), nullable=True)  # Intern, Senior, Junior, Manager (nullable for personalized mode)
    industry = db.Column(db.String(50), nullable=True)  # IT, Marketing, Sales, Finance, HR (nullable for personalized mode)
    style = db.Column(db.String(50), nullable=False)     # Nghiêm túc, Thân thiện, Khó tính
    language = db.Column(db.String(20), nullable=False)  # vi, en

    # Personalized mode data
    uploaded_files_info = db.Column(db.Text, nullable=True)  # JSON: extracted info from uploaded files
    custom_questions = db.Column(db.Text, nullable=True)     # JSON: AI-generated personalized questions

    # Session metadata
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    evaluation = db.Column(db.Text, nullable=True)  # Evaluation result from "Tổng kết phỏng vấn"
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
            'mode': self.mode,
            'position': self.position,
            'industry': self.industry,
            'style': self.style,
            'language': self.language,
            'uploaded_files_info': self.uploaded_files_info,
            'custom_questions': self.custom_questions,
            'status': self.status,
            'evaluation': self.evaluation,
            'created_at': self.created_at.isoformat(),
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }