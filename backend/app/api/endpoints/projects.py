from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from app.database import get_db
from app.crud import get_projects, get_project, get_featured_projects
from app.schemas import ProjectResponse

router = APIRouter()

# Public read-only routes. Writes live in admin.py behind the admin token; the
# unauthenticated POST/PUT/DELETE that used to live here let anyone rewrite or
# delete portfolio content.

@router.get("/", response_model=List[ProjectResponse])
def get_all_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all projects"""
    return get_projects(db, skip, limit)


@router.get("/featured", response_model=List[ProjectResponse])
def get_featured_projects_list(db: Session = Depends(get_db)):
    """Get featured projects"""
    return get_featured_projects(db)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_by_id(project_id: int, db: Session = Depends(get_db)):
    """Get a specific project"""
    project = get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
