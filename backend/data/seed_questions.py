"""
Seed script to load interview questions from JSON files into database.
Loads 20 JSON files (4 job levels × 5 industries) with complete question data.
"""

import json
import sys
from pathlib import Path

# Add parent directory to path to import models
sys.path.insert(0, str(Path(__file__).parent.parent))

from app import create_app
from models import (
    db, Industry, JobLevel, Position, QuestionType, PressureLevel,
    QuestionSection, InterviewQuestion, QuestionGuideline, SampleAnswer, PopupQuestion
)

def load_json_files():
    """Load all 20 JSON files from backend/data/interview_questions/"""
    data_dir = Path(__file__).parent / 'interview_questions'
    job_levels = ['intern', 'junior', 'senior', 'manager']
    industries = ['it', 'marketing', 'sales', 'finance', 'hr']

    all_data = []
    for level in job_levels:
        for industry in industries:
            file_path = data_dir / level / f'{industry}.json'
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    data['job_level'] = level
                    data['industry_key'] = industry
                    all_data.append(data)
                print(f"[OK] Loaded {file_path.name}")
            else:
                print(f"[MISSING] Missing {file_path}")

    return all_data

def seed_base_data():
    """Seed industries, job levels, question types, and pressure levels."""
    print("\n=== Seeding Base Data ===")

    # Industries
    industries = [
        {'name': 'IT', 'key': 'it'},
        {'name': 'Marketing', 'key': 'marketing'},
        {'name': 'Sales', 'key': 'sales'},
        {'name': 'Finance', 'key': 'finance'},
        {'name': 'HR', 'key': 'hr'}
    ]

    industry_map = {}
    for ind in industries:
        existing = Industry.query.filter_by(name=ind['name']).first()
        if not existing:
            new_ind = Industry(name=ind['name'])
            db.session.add(new_ind)
            db.session.flush()
            industry_map[ind['key']] = new_ind.id
        else:
            industry_map[ind['key']] = existing.id

    print(f"[OK] Seeded {len(industries)} industries")

    # Job Levels
    job_levels = [
        {'name': 'Intern', 'key': 'intern'},
        {'name': 'Junior', 'key': 'junior'},
        {'name': 'Senior', 'key': 'senior'},
        {'name': 'Manager', 'key': 'manager'}
    ]

    job_level_map = {}
    for level in job_levels:
        existing = JobLevel.query.filter_by(name=level['name']).first()
        if not existing:
            new_level = JobLevel(name=level['name'])
            db.session.add(new_level)
            db.session.flush()
            job_level_map[level['key']] = new_level.id
        else:
            job_level_map[level['key']] = existing.id

    print(f"[OK] Seeded {len(job_levels)} job levels")

    db.session.commit()

    return industry_map, job_level_map

def seed_questions(json_data, industry_map, job_level_map):
    """Seed questions from JSON data."""
    print("\n=== Seeding Questions ===")

    total_questions = 0
    total_sections = 0
    total_positions = 0

    for data in json_data:
        industry_id = industry_map[data['industry_key']]
        job_level_id = job_level_map[data['job_level']]

        # Create Position
        position_name = f"{data['industry']} {data['position']}"
        position = Position(
            name=position_name,
            industry_id=industry_id,
            job_level_id=job_level_id,
            language=data.get('language', 'vi'),
            total_duration_minutes=data.get('total_duration_minutes')
        )
        db.session.add(position)
        db.session.flush()
        total_positions += 1

        # Create Sections and Questions
        for section_data in data.get('sections', []):
            section = QuestionSection(
                position_id=position.id,
                section_number=section_data['section_number'],
                section_name=section_data.get('section_name'),
                duration_minutes=section_data.get('duration_minutes')
            )
            db.session.add(section)
            db.session.flush()
            total_sections += 1

            # Create Questions
            for idx, q_data in enumerate(section_data.get('questions', []), 1):
                # Find or create question type
                question_type_id = None
                if q_data.get('question_type'):
                    q_type_name = q_data['question_type']
                    q_type = QuestionType.query.filter_by(name=q_type_name).first()
                    if not q_type:
                        q_type = QuestionType(name=q_type_name)
                        db.session.add(q_type)
                        db.session.flush()
                    question_type_id = q_type.id

                # Find or create pressure level
                pressure_level_id = None
                if q_data.get('pressure_level'):
                    p_level_name = q_data['pressure_level']
                    p_level = PressureLevel.query.filter_by(name=p_level_name).first()
                    if not p_level:
                        p_level = PressureLevel(name=p_level_name)
                        db.session.add(p_level)
                        db.session.flush()
                    pressure_level_id = p_level.id

                question = InterviewQuestion(
                    section_id=section.id,
                    question_type_id=question_type_id,
                    pressure_level_id=pressure_level_id,
                    question_id_code=q_data.get('question_id'),
                    question_text=q_data['question_text'],
                    question_text_en=q_data.get('question_text_en'),
                    question_type_text=q_data.get('question_type'),
                    pressure_level_text=q_data.get('pressure_level'),
                    purpose=q_data.get('purpose'),
                    expected_duration_minutes=q_data.get('expected_duration_minutes'),
                    question_number=idx
                )
                db.session.add(question)
                db.session.flush()
                total_questions += 1

                # Add Guidelines (must_have)
                for guideline_text in q_data.get('guidelines_must_have', []):
                    guideline = QuestionGuideline(
                        question_id=question.id,
                        guideline_type='must_have',
                        content=guideline_text
                    )
                    db.session.add(guideline)

                # Add Guidelines (should_avoid)
                for guideline_text in q_data.get('guidelines_should_avoid', []):
                    guideline = QuestionGuideline(
                        question_id=question.id,
                        guideline_type='should_avoid',
                        content=guideline_text
                    )
                    db.session.add(guideline)

                # Add Sample Answer
                if q_data.get('sample_answer'):
                    sample = SampleAnswer(
                        question_id=question.id,
                        answer_text=q_data['sample_answer']
                    )
                    db.session.add(sample)

                # Add Popup Questions
                for order, popup_text in enumerate(q_data.get('popup_questions', []), 1):
                    popup = PopupQuestion(
                        question_id=question.id,
                        popup_text=popup_text,
                        order_number=order
                    )
                    db.session.add(popup)

        print(f"[OK] {position_name}: {len(data.get('sections', []))} sections")

    db.session.commit()

    print(f"\n[OK] Total: {total_positions} positions, {total_sections} sections, {total_questions} questions")

def main():
    """Main seed function."""
    print("=" * 60)
    print("   TRUEMIRROR INTERVIEW QUESTIONS SEEDER")
    print("=" * 60)

    # Create Flask app context
    app = create_app()

    with app.app_context():
        # Clear existing data (optional - comment out if you want to keep existing data)
        print("\n=== Clearing Existing Data ===")
        PopupQuestion.query.delete()
        SampleAnswer.query.delete()
        QuestionGuideline.query.delete()
        InterviewQuestion.query.delete()
        QuestionSection.query.delete()
        Position.query.delete()
        QuestionType.query.delete()
        PressureLevel.query.delete()
        JobLevel.query.delete()
        Industry.query.delete()
        db.session.commit()
        print("[OK] Cleared existing data")

        # Load JSON files
        print("\n=== Loading JSON Files ===")
        json_data = load_json_files()
        print(f"[OK] Loaded {len(json_data)} files")

        # Seed base data
        industry_map, job_level_map = seed_base_data()

        # Seed questions
        seed_questions(json_data, industry_map, job_level_map)

        print("\n" + "=" * 60)
        print("   [OK] SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 60)

if __name__ == '__main__':
    main()
