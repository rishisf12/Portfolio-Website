#!/usr/bin/env python
"""Update projects with curated attractive Unsplash images."""

import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlmodel import Session, select
from app.database import engine
from app.models import Project


# Curated high-quality Unsplash images for each project theme
PROJECT_IMAGES = {
    "Portfolio Website": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&q=80",
    "CampusPilot": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=80",
    "UrTeam (TeamPilot)": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
    "PocketPilot (pocketF)": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&q=80",
    "Master DSA Frontend": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop&q=80",
    "Master DSA Backend": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&q=80",
}


def update_images():
    with Session(engine) as session:
        projects = session.exec(select(Project)).all()
        
        for project in projects:
            if project.title in PROJECT_IMAGES:
                old_image = project.image
                project.image = PROJECT_IMAGES[project.title]
                session.add(project)
                print(f"Updated: {project.title}")
                print(f"  Old: {old_image[:80]}...")
                print(f"  New: {project.image[:80]}...")
        
        session.commit()
        print(f"\n✅ Updated {len(projects)} project images!")


if __name__ == "__main__":
    update_images()