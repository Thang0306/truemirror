from app import create_app
from models import InterviewSession, User

app = create_app()

with app.app_context():
    print("\n" + "="*60)
    print("DANH SÁCH INTERVIEW SESSIONS")
    print("="*60)
    
    sessions = InterviewSession.query.all()
    
    for session in sessions:
        user = User.query.get(session.user_id)
        print(f"\n📌 Session ID: {session.id}")
        print(f"   User: {user.full_name} ({user.email})")
        print(f"   Vị trí: {session.position}")
        print(f"   Ngành: {session.industry}")
        print(f"   Phong cách: {session.style}")
        print(f"   Ngôn ngữ: {'Tiếng Việt' if session.language == 'vi' else 'English'}")
        print(f"   Status: {session.status}")
        print(f"   Created: {session.created_at}")
    
    print("\n" + "="*60)
    print(f"TỔNG: {len(sessions)} sessions")
    print("="*60 + "\n")