from datetime import datetime, timezone
from .user import db

class Industry(db.Model):
    """Ngành nghề (e.g., Marketing, IT, Logistics)"""
    __tablename__ = 'industries'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

    # Relationships
    positions = db.relationship('Position', backref='industry', lazy=True)

class JobLevel(db.Model):
    """Cấp độ công việc (Intern, Senior, Manager, etc.)"""
    __tablename__ = 'job_levels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

    # Relationships
    positions = db.relationship('Position', backref='job_level', lazy=True)

class Position(db.Model):
    """Vị trí công việc cụ thể (e.g., Content Marketing Executive, Data Engineer Intern)"""
    __tablename__ = 'positions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    industry_id = db.Column(db.Integer, db.ForeignKey('industries.id'), nullable=False)
    job_level_id = db.Column(db.Integer, db.ForeignKey('job_levels.id'), nullable=False)
    language = db.Column(db.String(10), default='vi')  # vi or en
    total_duration_minutes = db.Column(db.Integer)  # Tổng thời gian phỏng vấn
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

    # Relationships
    sections = db.relationship('QuestionSection', backref='position', lazy=True, cascade='all, delete-orphan')

class QuestionType(db.Model):
    """Loại câu hỏi (Behavioral, Conceptual, Situational, Technical, Stress, Ethical, Ambiguous)"""
    __tablename__ = 'question_types'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text)
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

    # Relationships
    questions = db.relationship('InterviewQuestion', backref='question_type', lazy=True)

class PressureLevel(db.Model):
    """Mức độ áp lực (Low, Medium, High)"""
    __tablename__ = 'pressure_levels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False, unique=True)
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

    # Relationships
    questions = db.relationship('InterviewQuestion', backref='pressure_level', lazy=True)

class QuestionSection(db.Model):
    """Phần trong bộ câu hỏi (PHẦN 1, PHẦN 2, etc.)"""
    __tablename__ = 'question_sections'

    id = db.Column(db.Integer, primary_key=True)
    position_id = db.Column(db.Integer, db.ForeignKey('positions.id'), nullable=False)
    section_number = db.Column(db.Integer, nullable=False)  # 1, 2, 3...
    section_name = db.Column(db.String(200))  # Tên section
    duration_minutes = db.Column(db.Integer)  # Thời gian dự kiến
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

    # Relationships
    questions = db.relationship('InterviewQuestion', backref='section', lazy=True)

class InterviewQuestion(db.Model):
    """Câu hỏi phỏng vấn chính"""
    __tablename__ = 'interview_questions'

    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('question_sections.id'), nullable=False)
    question_type_id = db.Column(db.Integer, db.ForeignKey('question_types.id'), nullable=True)
    pressure_level_id = db.Column(db.Integer, db.ForeignKey('pressure_levels.id'), nullable=True)

    # Question content
    question_id_code = db.Column(db.String(50), unique=True)  # e.g., IT_INTERN_01
    question_text = db.Column(db.Text, nullable=False)
    question_text_en = db.Column(db.Text)  # English version
    question_type_text = db.Column(db.String(100))  # Store raw type from JSON
    pressure_level_text = db.Column(db.String(50))  # Store raw pressure from JSON
    purpose = db.Column(db.Text)  # Mục đích của câu hỏi
    expected_duration_minutes = db.Column(db.Integer)  # Thời gian trả lời dự kiến

    # Metadata
    question_number = db.Column(db.Integer)  # Số thứ tự trong section
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

    # Relationships
    guidelines = db.relationship('QuestionGuideline', backref='question', lazy=True, cascade='all, delete-orphan')
    sample_answers = db.relationship('SampleAnswer', backref='question', lazy=True, cascade='all, delete-orphan')
    popup_questions = db.relationship('PopupQuestion', backref='question', lazy=True, cascade='all, delete-orphan')

class QuestionGuideline(db.Model):
    """Hướng dẫn đánh giá câu trả lời (phải có/nên tránh)"""
    __tablename__ = 'question_guidelines'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('interview_questions.id'), nullable=False)
    guideline_type = db.Column(db.String(20), nullable=False)  # 'must_have' or 'should_avoid'
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

class SampleAnswer(db.Model):
    """Câu trả lời mẫu"""
    __tablename__ = 'sample_answers'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('interview_questions.id'), nullable=False)
    answer_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)

class PopupQuestion(db.Model):
    """Câu hỏi POP-UP (follow-up questions)"""
    __tablename__ = 'popup_questions'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('interview_questions.id'), nullable=False)
    popup_text = db.Column(db.Text, nullable=False)
    order_number = db.Column(db.Integer)  # Thứ tự popup question
    created_at = db.Column(
    db.DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc)
)
