from typing import List

from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from app.core.config import settings
from app.core.database import engine, get_session, create_db_and_tables
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
)
from app import models, schemas

app = FastAPI(title="Portfolio API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ---------- Startup ----------
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed_default_data()


def seed_default_data():
    from app.core.database import engine as _engine
    from sqlmodel import Session as _Session
    with _Session(_engine) as session:
        # Admin user
        existing = session.exec(
            select(models.User).where(models.User.username == settings.ADMIN_USERNAME)
        ).first()
        if not existing:
            user = models.User(
                username=settings.ADMIN_USERNAME,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            )
            session.add(user)
            session.commit()

        # Categories
        for cat_name, cat_slug in [("Technical", "technical"), ("Mechanical", "mechanical")]:
            exists = session.exec(
                select(models.Category).where(models.Category.slug == cat_slug)
            ).first()
            if not exists:
                session.add(models.Category(name=cat_name, slug=cat_slug))
        session.commit()

        # Settings defaults
        defaults = {
            "site_title": "Rishikesh Saroj | Portfolio",
            "bio": "B.Tech Mechanical Engineering student at PDPM IIITDM Jabalpur with a strong passion for Artificial Intelligence and Deep Learning.",
            "email": "rishikeshsaroj10@gmail.com",
            "location": "Jabalpur, Madhya Pradesh",
            "github": "https://github.com/rishisf12",
            "linkedin": "https://linkedin.com/in/rishisf12",
            "twitter": "https://twitter.com/rishisf12",
            "theme": "dark",
        }
        for key, value in defaults.items():
            exists = session.exec(select(models.Setting).where(models.Setting.key == key)).first()
            if not exists:
                session.add(models.Setting(key=key, value=value))
        session.commit()


# ---------- Auth ----------
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    username = payload.get("sub")
    user = session.exec(select(models.User).where(models.User.username == username)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@app.post("/auth/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, session: Session = Depends(get_session)):
    user = session.exec(
        select(models.User).where(models.User.username == user_in.username)
    ).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token}


@app.get("/auth/me")
def me(current_user: models.User = Depends(get_current_user)):
    return {"username": current_user.username, "is_active": current_user.is_active}


# ---------- Public: Settings ----------
@app.get("/public/settings", response_model=List[schemas.SettingOut])
def public_settings(session: Session = Depends(get_session)):
    return session.exec(select(models.Setting)).all()


# ---------- Public: Categories ----------
@app.get("/public/categories", response_model=List[schemas.CategoryOut])
def public_categories(session: Session = Depends(get_session)):
    return session.exec(select(models.Category)).all()


# ---------- Public: Projects ----------
@app.get("/public/projects", response_model=List[schemas.ProjectOut])
def public_projects(session: Session = Depends(get_session), category: Optional[str] = None):
    query = select(models.Project).where(models.Project.is_published == True)
    if category:
        query = query.join(models.Category).where(models.Category.slug == category)
    return session.exec(query).all()


@app.get("/public/projects/{slug}", response_model=schemas.ProjectOut)
def public_project_detail(slug: str, session: Session = Depends(get_session)):
    project = session.exec(
        select(models.Project).where(models.Project.slug == slug)
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ---------- Public: Skills ----------
@app.get("/public/skills", response_model=List[schemas.SkillOut])
def public_skills(session: Session = Depends(get_session), category: Optional[str] = None):
    query = select(models.Skill)
    if category:
        query = query.join(models.Category).where(models.Category.slug == category)
    return session.exec(query).all()


# ---------- Public: Education ----------
@app.get("/public/education", response_model=List[schemas.EducationOut])
def public_education(session: Session = Depends(get_session)):
    return session.exec(select(models.Education).order_by(models.Education.sort_order)).all()


# ---------- Public: Achievements ----------
@app.get("/public/achievements", response_model=List[schemas.AchievementOut])
def public_achievements(session: Session = Depends(get_session)):
    return session.exec(
        select(models.Achievement).order_by(models.Achievement.sort_order)
    ).all()


# ---------- Admin: Projects (CRUD) ----------
@app.post("/admin/projects", response_model=schemas.ProjectOut)
def create_project(
    project: schemas.ProjectCreate,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    db_project = models.Project.model_validate(project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


@app.patch("/admin/projects/{project_id}", response_model=schemas.ProjectOut)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    project = session.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    project.updated_at = datetime.utcnow()
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@app.delete("/admin/projects/{project_id}")
def delete_project(
    project_id: int,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    project = session.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    return {"ok": True}


# ---------- Admin: Project Images ----------
@app.post("/admin/projects/{project_id}/images", response_model=schemas.ProjectImageOut)
def upload_project_image(
    project_id: int,
    image_url: str,
    alt_text: Optional[str] = None,
    sort_order: int = 0,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    project = session.get(models.Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    img = models.ProjectImage(
        project_id=project_id,
        image_url=image_url,
        alt_text=alt_text,
        sort_order=sort_order,
    )
    session.add(img)
    session.commit()
    session.refresh(img)
    return img


@app.delete("/admin/project-images/{image_id}")
def delete_project_image(
    image_id: int,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    img = session.get(models.ProjectImage, image_id)
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    session.delete(img)
    session.commit()
    return {"ok": True}


# ---------- Admin: Skills ----------
@app.post("/admin/skills", response_model=schemas.SkillOut)
def create_skill(
    skill: schemas.SkillCreate,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    db_skill = models.Skill.model_validate(skill)
    session.add(db_skill)
    session.commit()
    session.refresh(db_skill)
    return db_skill


@app.get("/admin/skills", response_model=List[schemas.SkillOut])
def list_skills(
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    return session.exec(select(models.Skill)).all()


@app.delete("/admin/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    skill = session.get(models.Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    session.delete(skill)
    session.commit()
    return {"ok": True}


# ---------- Admin: Education ----------
@app.post("/admin/education", response_model=schemas.EducationOut)
def create_education(
    edu: schemas.EducationCreate,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    db_edu = models.Education.model_validate(edu)
    session.add(db_edu)
    session.commit()
    session.refresh(db_edu)
    return db_edu


@app.get("/admin/education", response_model=List[schemas.EducationOut])
def list_education(
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    return session.exec(select(models.Education).order_by(models.Education.sort_order)).all()


@app.delete("/admin/education/{edu_id}")
def delete_education(
    edu_id: int,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    edu = session.get(models.Education, edu_id)
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    session.delete(edu)
    session.commit()
    return {"ok": True}


# ---------- Admin: Achievements ----------
@app.post("/admin/achievements", response_model=schemas.AchievementOut)
def create_achievement(
    ach: schemas.AchievementCreate,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    db_ach = models.Achievement.model_validate(ach)
    session.add(db_ach)
    session.commit()
    session.refresh(db_ach)
    return db_ach


@app.get("/admin/achievements", response_model=List[schemas.AchievementOut])
def list_achievements(
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    return session.exec(
        select(models.Achievement).order_by(models.Achievement.sort_order)
    ).all()


@app.delete("/admin/achievements/{ach_id}")
def delete_achievement(
    ach_id: int,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    ach = session.get(models.Achievement, ach_id)
    if not ach:
        raise HTTPException(status_code=404, detail="Achievement not found")
    session.delete(ach)
    session.commit()
    return {"ok": True}


# ---------- Admin: Settings ----------
@app.get("/admin/settings", response_model=List[schemas.SettingOut])
def list_settings(
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    return session.exec(select(models.Setting)).all()


@app.patch("/admin/settings/{key}")
def update_setting(
    key: str,
    setting_in: schemas.SettingCreate,
    session: Session = Depends(get_session),
    current_user: models.User = Depends(get_current_user),
):
    setting = session.exec(select(models.Setting).where(models.Setting.key == key)).first()
    if not setting:
        setting = models.Setting(key=key, value=setting_in.value)
        session.add(setting)
    else:
        setting.value = setting_in.value
        session.add(setting)
    session.commit()
    return {"ok": True}