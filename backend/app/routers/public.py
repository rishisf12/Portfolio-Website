from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.database import get_session
from app.models import (
    Achievement,
    Category,
    Education,
    Project,
    Setting,
    Skill,
)

router = APIRouter(prefix="/public", tags=["public"])


def serialize_project(p: Project) -> dict:
    return {
        "id": p.id,
        "title": p.title,
        "slug": p.slug,
        "summary": p.summary,
        "description": p.description,
        "tech_stack": p.tech_stack,
        "style_theme": p.style_theme,
        "demo_url": p.demo_url,
        "github_url": p.github_url,
        "is_published": p.is_published,
        "category": {"id": p.category.id, "name": p.category.name, "slug": p.category.slug}
        if p.category
        else None,
        "images": [
            {"id": i.id, "image_url": i.image_url, "alt_text": i.alt_text, "sort_order": i.sort_order}
            for i in sorted(p.images, key=lambda i: i.sort_order)
        ],
        "created_at": p.created_at,
    }


@router.get("/categories")
def list_categories(session: Session = Depends(get_session)):
    categories = session.exec(select(Category)).all()
    return [
        {"id": c.id, "name": c.name, "slug": c.slug, "description": c.description}
        for c in categories
    ]


@router.get("/projects")
def list_projects(category: str | None = None, session: Session = Depends(get_session)):
    query = select(Project).where(Project.is_published == True)  # noqa: E712
    projects = session.exec(query).all()
    if category:
        projects = [p for p in projects if p.category and p.category.slug == category]
    return [serialize_project(p) for p in projects]


@router.get("/projects/{slug}")
def project_detail(slug: str, session: Session = Depends(get_session)):
    project = session.exec(select(Project).where(Project.slug == slug)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_project(project)


@router.get("/skills")
def list_skills(category: str | None = None, session: Session = Depends(get_session)):
    skills = session.exec(select(Skill)).all()
    if category:
        skills = [s for s in skills if s.category and s.category.slug == category]
    return [
        {
            "id": s.id,
            "name": s.name,
            "level": s.level,
            "domain": s.domain,
            "category": s.category.name if s.category else None,
        }
        for s in skills
    ]


@router.get("/education")
def list_education(session: Session = Depends(get_session)):
    return [
        {
            "id": e.id,
            "institution": e.institution,
            "degree": e.degree,
            "field_of_study": e.field_of_study,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "grade": e.grade,
            "coursework": e.coursework,
        }
        for e in session.exec(select(Education).order_by(Education.sort_order)).all()
    ]


@router.get("/achievements")
def list_achievements(session: Session = Depends(get_session)):
    return [
        {
            "id": a.id,
            "title": a.title,
            "issuer": a.issuer,
            "date": a.date,
            "description": a.description,
            "certificate_url": a.certificate_url,
            "image_url": a.image_url,
        }
        for a in session.exec(select(Achievement).order_by(Achievement.sort_order)).all()
    ]


@router.get("/settings")
def list_settings(session: Session = Depends(get_session)):
    settings = session.exec(select(Setting)).all()
    return {s.key: s.value for s in settings}
