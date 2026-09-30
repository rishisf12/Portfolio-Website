from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional, List

# ============ CONTACT SCHEMAS ============
class ContactBase(BaseModel):
    # Bounds match the column widths in models.py and cap anonymous input.
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=100)
    message: str = Field(min_length=1, max_length=5000)

class ContactCreate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id: int
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True

# ============ PROJECT SCHEMAS ============
class ProjectBase(BaseModel):
    title: str
    description: str
    image: str
    tags: List[str]
    live_demo_url: str
    github_url: str
    is_featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    tags: Optional[List[str]] = None
    live_demo_url: Optional[str] = None
    github_url: Optional[str] = None
    is_featured: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    @validator('tags', pre=True)
    def parse_tags(cls, v):
        if isinstance(v, str):
            return v.split(',')
        return v

    class Config:
        from_attributes = True