"""
User Assessment Model
Stores AI-generated overall assessments for users
Only one assessment per user (most recent)
"""

from datetime import datetime, timezone
from models.user import db

class UserAssessment(db.Model):
    __tablename__ = 'user_assessments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True, index=True)
    assessment_content = db.Column(db.Text, nullable=False)
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
    user = db.relationship('User', backref='assessment', foreign_keys=[user_id])

    def to_dict(self):
        """Convert assessment to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'assessment_content': self.assessment_content,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<UserAssessment user_id={self.user_id}>'
