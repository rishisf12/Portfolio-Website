from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from app.database import get_db
from app.crud import (
    create_project, get_projects, get_project, 
    update_project, delete_project, get_featured_projects
)
from app.schemas import ProjectCreate, ProjectResponse

router = APIRouter()

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_new_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project"""
    return create_project(db, project)

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

@router.put("/{project_id}", response_model=ProjectResponse)
def update_existing_project(project_id: int, project_update: ProjectCreate, db: Session = Depends(get_db)):
    """Update a project"""
    updated_project = update_project(db, project_id, project_update.model_dump())
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a project"""
    deleted = delete_project(db, project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return None