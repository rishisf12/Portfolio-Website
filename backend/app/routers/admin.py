import shutil
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile
from pydantic import BaseModel
from sqlmodel import Session, select

from app.auth.auth import create_access_token
from app.core.config import settings
from app.core.database import get_session
from app.models import (
    Achievement,
    Category,
    Education,
    Project,
    ProjectImage,
    Setting,
    Skill,
)

router = APIRouter(prefix="/admin", tags=["admin"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def require_admin(x_admin_token: Optional[str] = Header(default=None)):
    if x_admin_token != settings.ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid admin token")


class ProjectIn(BaseModel):
    title: str
    summary: str
    description: str = ""
    tech_stack: str = ""
    style_theme: str = "modern"
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    is_published: bool = True
    category_slug: Optional[str] = None
    slug: Optional[str] = None


class SkillIn(BaseModel):
    name: str
    level: str = "Intermediate"
    domain: Optional[str] = None
    category_slug: Optional[str] = None


class EducationIn(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    grade: Optional[str] = None
    coursework: Optional[str] = None


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    grade: Optional[str] = None
    coursework: Optional[str] = None
    sort_order: Optional[int] = None


class AchievementIn(BaseModel):
    title: str
    issuer: Optional[str] = None
    date: str = "2025"
    description: Optional[str] = None
    certificate_url: Optional[str] = None


class SettingIn(BaseModel):
    value: str


def slugify(value: str) -> str:
    cleaned = "".join(c.lower() if c.isalnum() else "-" for c in value)
    while "--" in cleaned:
        cleaned = cleaned.replace("--", "-")
    return cleaned.strip("-") or f"project-{uuid.uuid4().hex[:6]}"


def category_id_for(session: Session, slug: Optional[str]) -> Optional[int]:
    if not slug:
        return None
    category = session.exec(select(Category).where(Category.slug == slug)).first()
    return category.id if category else None


def project_payload(project: Project) -> dict:
    return {
        "id": project.id,
        "title": project.title,
        "slug": project.slug,
        "summary": project.summary,
        "description": project.description,
        "tech_stack": project.tech_stack,
        "style_theme": project.style_theme,
        "demo_url": project.demo_url,
        "github_url": project.github_url,
        "is_published": project.is_published,
        "category": {"id": project.category.id, "name": project.category.name, "slug": project.category.slug}
        if project.category
        else None,
        "images": [
            {"id": i.id, "image_url": i.image_url, "alt_text": i.alt_text, "sort_order": i.sort_order}
            for i in sorted(project.images, key=lambda i: i.sort_order)
        ],
    }


@router.get("/categories", dependencies=[Depends(require_admin)])
def list_categories(session: Session = Depends(get_session)):
    categories = session.exec(select(Category)).all()
    return [
        {"id": c.id, "name": c.name, "slug": c.slug, "description": c.description}
        for c in categories
    ]


@router.get("/stats", dependencies=[Depends(require_admin)])
def stats(session: Session = Depends(get_session)):
    projects = session.exec(select(Project)).all()
    return {
        "projects": len(projects),
        "published": len([p for p in projects if p.is_published]),
        "skills": len(session.exec(select(Skill)).all()),
        "education": len(session.exec(select(Education)).all()),
        "achievements": len(session.exec(select(Achievement)).all()),
    }


# ------------------------------- projects -------------------------------


@router.get("/projects", dependencies=[Depends(require_admin)])
def list_projects(session: Session = Depends(get_session)):
    return [project_payload(p) for p in session.exec(select(Project)).all()]


@router.post("/projects", dependencies=[Depends(require_admin)])
def create_project(data: ProjectIn, session: Session = Depends(get_session)):
    base_slug = data.slug or slugify(data.title)
    slug = base_slug
    counter = 2
    while session.exec(select(Project).where(Project.slug == slug)).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    project = Project(
        title=data.title,
        slug=slug,
        summary=data.summary,
        description=data.description,
        tech_stack=data.tech_stack,
        style_theme=data.style_theme,
        demo_url=data.demo_url,
        github_url=data.github_url,
        is_published=data.is_published,
        category_id=category_id_for(session, data.category_slug),
    )
    session.add(project)
    session.commit()
    session.refresh(project)
    return project_payload(project)


@router.patch("/projects/{project_id}", dependencies=[Depends(require_admin)])
def update_project(project_id: int, data: ProjectIn, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.title = data.title
    project.summary = data.summary
    project.description = data.description
    project.tech_stack = data.tech_stack
    project.style_theme = data.style_theme
    project.demo_url = data.demo_url
    project.github_url = data.github_url
    project.is_published = data.is_published
    project.category_id = category_id_for(session, data.category_slug)
    if data.slug:
        project.slug = slugify(data.slug)

    session.add(project)
    session.commit()
    session.refresh(project)
    return project_payload(project)


@router.delete("/projects/{project_id}", dependencies=[Depends(require_admin)])
def delete_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for image in list(project.images):
        session.delete(image)
    session.delete(project)
    session.commit()
    return {"ok": True}


@router.post("/projects/{project_id}/images", dependencies=[Depends(require_admin)])
def upload_project_image(
    project_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    suffix = Path(file.filename or "image.png").suffix.lower() or ".png"
    name = f"{project.slug}-{uuid.uuid4().hex[:8]}{suffix}"
    destination = UPLOAD_DIR / name
    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = ProjectImage(
        project_id=project.id,
        image_url=f"/uploads/{name}",
        alt_text=project.title,
        sort_order=len(project.images),
    )
    session.add(image)
    session.commit()
    session.refresh(image)
    return {"id": image.id, "image_url": image.image_url}


@router.delete("/project-images/{image_id}", dependencies=[Depends(require_admin)])
def delete_project_image(image_id: int, session: Session = Depends(get_session)):
    image = session.get(ProjectImage, image_id)
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    session.delete(image)
    session.commit()
    return {"ok": True}


# -------------------------------- skills --------------------------------


@router.get("/skills", dependencies=[Depends(require_admin)])
def list_skills(session: Session = Depends(get_session)):
    return [
        {"id": s.id, "name": s.name, "level": s.level, "domain": s.domain, "category": s.category.name if s.category else None}
        for s in session.exec(select(Skill)).all()
    ]


@router.post("/skills", dependencies=[Depends(require_admin)])
def create_skill(data: SkillIn, session: Session = Depends(get_session)):
    skill = Skill(
        name=data.name,
        level=data.level,
        domain=data.domain,
        category_id=category_id_for(session, data.category_slug),
    )
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return {"id": skill.id, "name": skill.name, "level": skill.level, "domain": skill.domain}


@router.delete("/skills/{skill_id}", dependencies=[Depends(require_admin)])
def delete_skill(skill_id: int, session: Session = Depends(get_session)):
    skill = session.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    session.delete(skill)
    session.commit()
    return {"ok": True}


# ------------------------------- education ------------------------------


@router.get("/education", dependencies=[Depends(require_admin)])
def list_education(session: Session = Depends(get_session)):
    return session.exec(select(Education).order_by(Education.sort_order)).all()


@router.post("/education", dependencies=[Depends(require_admin)])
def create_education(data: EducationIn, session: Session = Depends(get_session)):
    entry = Education(**data.model_dump())
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


@router.delete("/education/{entry_id}", dependencies=[Depends(require_admin)])
def delete_education(entry_id: int, session: Session = Depends(get_session)):
    entry = session.get(Education, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Education not found")
    session.delete(entry)
    session.commit()
    return {"ok": True}


@router.put("/education/{entry_id}", dependencies=[Depends(require_admin)])
def update_education(
    entry_id: int, data: EducationUpdate, session: Session = Depends(get_session)
):
    entry = session.get(Education, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Education not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)

    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


# ------------------------------ achievements ----------------------------


@router.get("/achievements", dependencies=[Depends(require_admin)])
def list_achievements(session: Session = Depends(get_session)):
    return session.exec(select(Achievement).order_by(Achievement.sort_order)).all()


@router.post("/achievements", dependencies=[Depends(require_admin)])
def create_achievement(data: AchievementIn, session: Session = Depends(get_session)):
    entry = Achievement(**data.model_dump())
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


@router.delete("/achievements/{entry_id}", dependencies=[Depends(require_admin)])
def delete_achievement(entry_id: int, session: Session = Depends(get_session)):
    entry = session.get(Achievement, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Achievement not found")
    session.delete(entry)
    session.commit()
    return {"ok": True}


# -------------------------------- settings ------------------------------


@router.get("/settings", dependencies=[Depends(require_admin)])
def list_settings(session: Session = Depends(get_session)):
    return {s.key: s.value for s in session.exec(select(Setting)).all()}


@router.patch("/settings/{key}", dependencies=[Depends(require_admin)])
def update_setting(key: str, data: SettingIn, session: Session = Depends(get_session)):
    setting = session.exec(select(Setting).where(Setting.key == key)).first()
    if not setting:
        setting = Setting(key=key, value=data.value)
    else:
        setting.value = data.value
    session.add(setting)
    session.commit()
    return {"key": key, "value": setting.value}


@router.get("/token-check")
def token_check():
    return {"token": create_access_token({"sub": settings.ADMIN_USERNAME}), "admin": settings.ADMIN_USERNAME}
