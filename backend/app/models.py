from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Contact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    email: str = Field(max_length=100)
    message: str
    created_at: datetime = Field(default_factory=datetime.now)
    is_read: bool = Field(default=False)

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200)
    description: str
    image: str = Field(max_length=500)
    tags: str  # Store as comma-separated string
    live_demo_url: str = Field(max_length=500)
    github_url: str = Field(max_length=500)
    created_at: datetime = Field(default_factory=datetime.now)
    is_featured: bool = Field(default=False)