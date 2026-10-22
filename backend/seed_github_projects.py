#!/usr/bin/env python
"""Seed portfolio database with projects from GitHub repos."""

import os
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlmodel import Session, select
from app.database import engine, create_db_and_tables
from app.models import Project
from app.core.config import settings


GITHUB_PROJECTS = [
    {
        "title": "Portfolio Website",
        "description": "A modern, full-stack portfolio website built with React (Vite), FastAPI, PostgreSQL, and Tailwind CSS. Features an admin dashboard for managing projects and contact messages, JWT authentication, Cloudinary image uploads, and a responsive dark-themed UI with smooth animations.",
        "image": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
        "tags": "React, FastAPI, PostgreSQL, Tailwind CSS, JWT, Cloudinary, Docker, Nginx",
        "live_demo_url": "https://portfolio-website-rishisf13.vercel.app",
        "github_url": "https://github.com/rishisf12/Portfolio-Website",
        "is_featured": True,
    },
    {
        "title": "CampusPilot",
        "description": "Academic management module for college campuses - handles attendance tracking, timetable parsing from PDFs, exam scheduling, room vacancy detection, and student profiles. Built in ~5.5 hours with focus on running on first try, simple debuggable code, and testable phases.",
        "image": "https://images.unsplash.com/photo-1501504905252-473c42e085f8?w=800&h=600&fit=crop",
        "tags": "Python, FastAPI, SQLModel, SQLite, React, Vite, Tailwind CSS, pdfplumber, pandas, reportlab",
        "live_demo_url": "",
        "github_url": "https://github.com/rishisf12/CampusPilot",
        "is_featured": True,
    },
    {
        "title": "UrTeam (TeamPilot)",
        "description": "Hackathon team matching platform that matches students by skill overlap using Jaccard similarity. Features student/idea management, team requests, and a matching algorithm. Backend uses FastAPI + SQLModel with PostgreSQL/SQLite fallback; frontend is React + Vite + Tailwind. ML training (Colab) kept separate from backend.",
        "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
        "tags": "FastAPI, SQLModel, PostgreSQL, React, Vite, Tailwind CSS, Jaccard Similarity, Docker",
        "live_demo_url": "",
        "github_url": "https://github.com/rishisf12/UrTeam",
        "is_featured": True,
    },
    {
        "title": "PocketPilot (pocketF)",
        "description": "Student budgeting tool with CLI and FastAPI backend. Tracks expenses by category (Canteen, Mess, Academics, Travel), provides analytics (daily burn rate, category breakdown, cash flow forecast), forecasting (\"money runs out on <date>\"), and generates charts via Matplotlib. Supports both CSV-based CLI and full-stack Docker + PostgreSQL deployment.",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
        "tags": "Python, FastAPI, PostgreSQL, SQLModel, Alembic, Matplotlib, Docker, CLI, CSV",
        "live_demo_url": "",
        "github_url": "https://github.com/rishisf12/pocketF",
        "is_featured": False,
    },
    {
        "title": "Master DSA Frontend",
        "description": "Frontend for Master DSA - a platform to track daily DSA practice with Python and C++. Built with React 19 + Vite, Oxlint for fast linting. Part of a full-stack application with FastAPI backend, PostgreSQL, and Gemini AI integration for code analysis.",
        "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
        "tags": "React, Vite, Oxlint, JavaScript, Frontend",
        "live_demo_url": "https://master-dsa-frontend.vercel.app",
        "github_url": "https://github.com/rishisf12/master-dsa-frontend",
        "is_featured": False,
    },
    {
        "title": "Master DSA Backend",
        "description": "Backend for Master DSA platform - tracks daily DSA practice with Python and C++. Features FastAPI, PostgreSQL, SQLModel, and Gemini AI for code analysis. Includes full project structure with API endpoints, services, schemas, models, tests, and utility scripts.",
        "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
        "tags": "FastAPI, PostgreSQL, SQLModel, Gemini AI, Python, Docker, REST API",
        "live_demo_url": "",
        "github_url": "https://github.com/rishisf12/master-dsa-backend",
        "is_featured": False,
    },
]


def seed_projects():
    create_db_and_tables()
    
    with Session(engine) as session:
        existing_count = len(session.exec(select(Project)).all())
        print(f"Existing projects in database: {existing_count}")
        
        if existing_count > 0:
            response = input("Database already has projects. Clear and reseed? (y/N): ")
            if response.lower() != 'y':
                print("Aborted.")
                return
            
            # Delete existing
            for project in session.exec(select(Project)).all():
                session.delete(project)
            session.commit()
            print("Cleared existing projects.")
        
        # Add new projects
        for i, proj_data in enumerate(GITHUB_PROJECTS):
            project = Project(**proj_data)
            session.add(project)
            print(f"Added: {proj_data['title']}")
        
        session.commit()
        print(f"\n✅ Successfully seeded {len(GITHUB_PROJECTS)} projects!")


if __name__ == "__main__":
    # Check required env vars
    if not settings.DATABASE_URL or "postgresql" not in settings.DATABASE_URL:
        print("⚠️  Warning: DATABASE_URL not set to PostgreSQL. Using default from config.")
    
    seed_projects()