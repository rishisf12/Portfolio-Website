"""Seed the portfolio database with the content from the original Portfolio-Website repo."""

from sqlmodel import Session, select

from app.core.database import create_db_and_tables, engine
from app.models import (
    Achievement,
    Category,
    Education,
    Project,
    ProjectImage,
    Setting,
    Skill,
)


PROJECTS = [
    {
        "title": "Portfolio Website",
        "slug": "portfolio-website",
        "summary": "Full-stack portfolio with React, FastAPI and an admin dashboard.",
        "description": (
            "A modern, full-stack portfolio website built with React (Vite), FastAPI, PostgreSQL and "
            "Tailwind CSS. Features an admin dashboard for managing projects and contact messages, "
            "JWT authentication, image uploads and a responsive dark-themed UI with smooth animations."
        ),
        "tech_stack": "React, FastAPI, PostgreSQL, Tailwind CSS, JWT, Docker, Nginx",
        "style_theme": "modern",
        "demo_url": "https://portfolio-website-rishisf13.vercel.app",
        "github_url": "https://github.com/rishisf12/Portfolio-Website",
        "image": "/projects/portfolio_website.png",
        "category": "technical",
    },
    {
        "title": "CampusPilot",
        "slug": "campuspilot",
        "summary": "Academic management module for college campuses.",
        "description": (
            "Academic management module for college campuses - handles attendance tracking, timetable "
            "parsing from PDFs, exam scheduling, room vacancy detection and student profiles. Built in "
            "~5.5 hours with focus on running on the first try, simple debuggable code and testable phases."
        ),
        "tech_stack": "Python, FastAPI, SQLModel, SQLite, React, Vite, Tailwind CSS, pdfplumber, pandas, reportlab",
        "style_theme": "modern",
        "demo_url": None,
        "github_url": "https://github.com/rishisf12/CampusPilot",
        "image": "/projects/campuspilot.png",
        "category": "technical",
    },
    {
        "title": "UrTeam (TeamPilot)",
        "slug": "urteam-teampilot",
        "summary": "Hackathon team matching platform using Jaccard similarity.",
        "description": (
            "Hackathon team matching platform that matches students by skill overlap using Jaccard "
            "similarity. Features student/idea management, team requests and a matching algorithm. "
            "Backend uses FastAPI + SQLModel with PostgreSQL/SQLite fallback; frontend is React + Vite + "
            "Tailwind. ML training (Colab) kept separate from the backend."
        ),
        "tech_stack": "FastAPI, SQLModel, PostgreSQL, React, Vite, Tailwind CSS, Jaccard Similarity, Docker",
        "style_theme": "modern",
        "demo_url": None,
        "github_url": "https://github.com/rishisf12/UrTeam",
        "image": "/projects/urteam_teampilot.png",
        "category": "technical",
    },
    {
        "title": "PocketPilot (pocketF)",
        "slug": "pocketpilot-pocketf",
        "summary": "Student budgeting tool with CLI and FastAPI backend.",
        "description": (
            "Student budgeting tool with CLI and FastAPI backend. Tracks expenses by category (Canteen, "
            "Mess, Academics, Travel), provides analytics (daily burn rate, category breakdown, cash flow "
            "forecast), forecasting (\"money runs out on <date>\") and generates charts via Matplotlib. "
            "Supports both CSV-based CLI and full-stack Docker + PostgreSQL deployment."
        ),
        "tech_stack": "Python, FastAPI, PostgreSQL, SQLModel, Alembic, Matplotlib, Docker, CLI, CSV",
        "style_theme": "minimal",
        "demo_url": None,
        "github_url": "https://github.com/rishisf12/pocketF",
        "image": "/projects/pocketpilot_pocketf.png",
        "category": "technical",
    },
    {
        "title": "Master DSA Frontend",
        "slug": "master-dsa-frontend",
        "summary": "Frontend for tracking daily DSA practice in Python and C++.",
        "description": (
            "Frontend for Master DSA - a platform to track daily DSA practice with Python and C++. "
            "Built with React 19 + Vite and Oxlint for fast linting. Part of a full-stack application "
            "with FastAPI backend, PostgreSQL and Gemini AI integration for code analysis."
        ),
        "tech_stack": "React, Vite, Oxlint, JavaScript, Frontend",
        "style_theme": "modern",
        "demo_url": "https://master-dsa-frontend.vercel.app",
        "github_url": "https://github.com/rishisf12/master-dsa-frontend",
        "image": "/projects/master_dsa_frontend.png",
        "category": "technical",
    },
    {
        "title": "Master DSA Backend",
        "slug": "master-dsa-backend",
        "summary": "Backend for the Master DSA platform with Gemini AI analysis.",
        "description": (
            "Backend for the Master DSA platform - tracks daily DSA practice with Python and C++. "
            "Features FastAPI, PostgreSQL, SQLModel and Gemini AI for code analysis. Includes a full "
            "project structure with API endpoints, services, schemas, models, tests and utility scripts."
        ),
        "tech_stack": "FastAPI, PostgreSQL, SQLModel, Gemini AI, Python, Docker, REST API",
        "style_theme": "modern",
        "demo_url": None,
        "github_url": "https://github.com/rishisf12/master-dsa-backend",
        "image": "/projects/master_dsa_backend.png",
        "category": "technical",
    },
]

SKILLS = [
    ("Python", "Advanced", "technical", "Languages"),
    ("React", "Intermediate", "technical", "Frontend"),
    ("FastAPI", "Advanced", "technical", "Backend"),
    ("Full Stack", "Advanced", "technical", "Full Stack"),
    ("Progressive Web App (PWA)", "Intermediate", "technical", "Full Stack"),
    ("PostgreSQL", "Advanced", "technical", "Databases"),
    ("TensorFlow", "Advanced", "technical", "Machine Learning"),
    ("AI / ML", "Advanced", "technical", "Machine Learning"),
    ("Generative AI", "Intermediate", "technical", "Machine Learning"),
    ("Deep Learning", "Advanced", "technical", "Deep Learning"),
    ("ANN / CNN / RNN", "Advanced", "technical", "Deep Learning"),
    ("CAD", "Intermediate", "mechanical", "Design"),
    ("Thermodynamics", "Intermediate", "mechanical", "Mechanical Engineering"),
    ("Robotics", "Intermediate", "mechanical", "Mechanical Engineering"),
]

EDUCATION = [
    {
        "institution": "PDPM IIITDM Jabalpur",
        "degree": "B.Tech Mechanical Engineering",
        "field_of_study": "Mechanical Engineering",
        "start_date": "2022",
        "end_date": "2026",
        "grade": "CGPA: 8.5+",
        "coursework": "AI/ML, Deep Learning, Thermodynamics, Robotics, CAD",
        "sort_order": 0,
    }
]

ACHIEVEMENTS = [
    {
        "title": "AI/ML Enthusiast",
        "issuer": "Self-Taught",
        "date": "2024",
        "description": "Deep learning with TensorFlow, ANN, CNN and RNN architectures.",
        "sort_order": 0,
    },
    {
        "title": "Mechanical Engineering",
        "issuer": "PDPM IIITDM Jabalpur",
        "date": "2022 - 2026",
        "description": "B.Tech program with focus on robotics and automation.",
        "sort_order": 1,
    },
]

SETTINGS = {
    "full_name": "Rishikesh Saroj",
    "headline": "AI/ML & GenAI Enthusiast",
    "bio": (
        "B.Tech Mechanical Engineering student at PDPM IIITDM Jabalpur, building intelligent "
        "systems at the intersection of mechanical engineering and AI."
    ),
    "about": (
        "Mechanical engineering student with a deep passion for Artificial Intelligence, Machine "
        "Learning and Generative AI. I enjoy building intelligent systems that bridge the gap "
        "between physical engineering and digital innovation."
    ),
    "hobby": "Playing Badminton",
    "email": "rishisf12@gmail.com",
    "github_url": "https://github.com/rishisf12",
    "linkedin_url": "https://linkedin.com/in/rishisf12",
    "twitter_url": "https://twitter.com/rishisf12",
    "location": "Jabalpur, India",
}


def seed() -> None:
    create_db_and_tables()

    with Session(engine) as session:
        for image in session.exec(select(ProjectImage)).all():
            session.delete(image)
        for project in session.exec(select(Project)).all():
            session.delete(project)
        for skill in session.exec(select(Skill)).all():
            session.delete(skill)
        for entry in session.exec(select(Education)).all():
            session.delete(entry)
        for entry in session.exec(select(Achievement)).all():
            session.delete(entry)
        for setting in session.exec(select(Setting)).all():
            session.delete(setting)
        for category in session.exec(select(Category)).all():
            session.delete(category)
        session.commit()

        technical = Category(name="Technical", slug="technical", description="AI/ML, software and deep learning work")
        mechanical = Category(name="Mechanical", slug="mechanical", description="Robotics, CAD and engineering work")
        session.add(technical)
        session.add(mechanical)
        session.commit()
        session.refresh(technical)
        session.refresh(mechanical)

        categories = {"technical": technical.id, "mechanical": mechanical.id}

        for index, data in enumerate(PROJECTS):
            project = Project(
                title=data["title"],
                slug=data["slug"],
                summary=data["summary"],
                description=data["description"],
                tech_stack=data["tech_stack"],
                style_theme=data["style_theme"],
                demo_url=data["demo_url"],
                github_url=data["github_url"],
                is_published=True,
                category_id=categories[data["category"]],
            )
            session.add(project)
            session.commit()
            session.refresh(project)

            session.add(
                ProjectImage(
                    project_id=project.id,
                    image_url=data["image"],
                    alt_text=data["title"],
                    sort_order=0,
                )
            )
            session.commit()
            print(f"seeded project: {project.title}")

        for name, level, category, domain in SKILLS:
            session.add(
                Skill(
                    name=name,
                    level=level,
                    domain=domain,
                    category_id=categories[category],
                )
            )

        for entry in EDUCATION:
            session.add(Education(**entry))

        for entry in ACHIEVEMENTS:
            session.add(Achievement(**entry))

        for key, value in SETTINGS.items():
            session.add(Setting(key=key, value=value))

        session.commit()
        print("seed complete")


if __name__ == "__main__":
    seed()
