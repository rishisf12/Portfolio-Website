from sqlmodel import Session, select
from app.models import Contact, Project
from app.schemas import ContactCreate, ProjectCreate, ProjectUpdate
from typing import List, Optional

# ============ CONTACT CRUD ============
def create_contact(session: Session, contact: ContactCreate) -> Contact:
    db_contact = Contact(**contact.model_dump())
    session.add(db_contact)
    session.commit()
    session.refresh(db_contact)
    return db_contact

def get_contacts(session: Session, skip: int = 0, limit: int = 100) -> List[Contact]:
    return session.exec(select(Contact).offset(skip).limit(limit)).all()

def get_contact(session: Session, contact_id: int) -> Optional[Contact]:
    return session.get(Contact, contact_id)

def mark_contact_read(session: Session, contact_id: int) -> Optional[Contact]:
    contact = session.get(Contact, contact_id)
    if contact:
        contact.is_read = True
        session.commit()
        session.refresh(contact)
    return contact

def delete_contact(session: Session, contact_id: int) -> bool:
    contact = session.get(Contact, contact_id)
    if contact:
        session.delete(contact)
        session.commit()
        return True
    return False

# ============ PROJECT CRUD ============
def create_project(session: Session, project: ProjectCreate) -> Project:
    # Convert tags list to string if needed
    project_data = project.model_dump()
    if isinstance(project_data.get('tags'), list):
        project_data['tags'] = ','.join(project_data['tags'])
    
    db_project = Project(**project_data)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project

def get_projects(session: Session, skip: int = 0, limit: int = 100) -> List[Project]:
    return session.exec(select(Project).offset(skip).limit(limit)).all()

def get_featured_projects(session: Session) -> List[Project]:
    return session.exec(select(Project).where(Project.is_featured == True)).all()

def get_project(session: Session, project_id: int) -> Optional[Project]:
    return session.get(Project, project_id)

def update_project(session: Session, project_id: int, project_update: dict) -> Optional[Project]:
    project = session.get(Project, project_id)
    if project:
        # Handle tags if they're a list
        if 'tags' in project_update and isinstance(project_update['tags'], list):
            project_update['tags'] = ','.join(project_update['tags'])
        
        for key, value in project_update.items():
            setattr(project, key, value)
        session.commit()
        session.refresh(project)
    return project

def delete_project(session: Session, project_id: int) -> bool:
    project = session.get(Project, project_id)
    if project:
        session.delete(project)
        session.commit()
        return True
    return False