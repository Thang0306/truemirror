from datetime import datetime, timezone
from .user import db

class Conversation(db.Model):
    __tablename__ = 'conversations'

    # Primary fields
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('interview_sessions.id'), nullable=False)

    # Conversation data
    messages_json = db.Column(db.Text, nullable=False)  # JSON array of messages

    # Metadata
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)
    updated_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc),
    onupdate=lambda: datetime.now(timezone.utc)
)

    # Relationship
    session = db.relationship('InterviewSession', backref=db.backref('conversation', lazy=True, uselist=False))

    def __repr__(self):
        return f'<Conversation {self.id} - Session {self.session_id}>'
