from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# ---------- Auth ----------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


# ---------- Category ----------
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Project Image ----------
class ProjectImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    sort_order: int = 0


class ProjectImageCreate(ProjectImageBase):
    pass


class ProjectImageOut(ProjectImageBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True


# ---------- Project ----------
class ProjectBase(BaseModel):
    title: str
    slug: str
    summary: str
    description: str
    tech_stack: str
    style_theme: str
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    is_published: bool = True
    category_id: Optional[int] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    style_theme: Optional[str] = None
    demo_url: Optional[str] = None
    github_url: Optional[str] = None
    is_published: Optional[bool] = None
    category_id: Optional[int] = None


class ProjectOut(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    images: List[ProjectImageOut] = []

    class Config:
        from_attributes = True


# ---------- Skill ----------
class SkillBase(BaseModel):
    name: str
    level: str
    category_id: Optional[int] = None


class SkillCreate(SkillBase):
    pass


class SkillOut(SkillBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Achievement ----------
class AchievementBase(BaseModel):
    title: str
    issuer: Optional[str] = None
    date: str
    description: Optional[str] = None
    certificate_url: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = 0


class AchievementCreate(AchievementBase):
    pass


class AchievementOut(AchievementBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Education ----------
class EducationBase(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    grade: Optional[str] = None
    coursework: Optional[str] = None
    sort_order: int = 0


class EducationCreate(EducationBase):
    pass


class EducationOut(EducationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Setting ----------
class SettingBase(BaseModel):
    key: str
    value: str


class SettingCreate(SettingBase):
    pass


class SettingOut(SettingBase):
    id: int

    class Config:
        from_attributes = True