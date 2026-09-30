from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query
from sqlmodel import Session
from typing import List
from pydantic import BaseModel, EmailStr
import io
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import cloudinary
import cloudinary.uploader
import cloudinary.api

logger = logging.getLogger(__name__)

from app.database import get_db
from app.crud import (
    get_contacts, get_contact, mark_contact_read, delete_contact,
    create_project, get_projects, get_project, update_project, delete_project
)
from app.schemas import ContactResponse, ProjectCreate, ProjectResponse, ProjectUpdate
from app.core.security import get_current_user
from app.core.config import settings

router = APIRouter()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

# ============ IMAGE UPLOAD ENDPOINT ============
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp']
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/upload-image")
def upload_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    """Upload an image to Cloudinary (Admin only)"""
    # Validate outside the try block so a rejection stays a 400 rather than
    # being swallowed and re-reported as a 500.
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}",
        )

    contents = file.file.read(MAX_UPLOAD_BYTES + 1)
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_UPLOAD_BYTES // (1024 * 1024)} MB",
        )

    try:
        result = cloudinary.uploader.upload(
            io.BytesIO(contents),
            folder="portfolio/projects",
            transformation=[
                {"width": 800, "height": 600, "crop": "limit"},
                {"quality": "auto:good"}
            ]
        )
    except HTTPException:
        raise
    except Exception:
        logger.exception("Cloudinary upload failed")
        # Do not forward the raw provider error to the client.
        raise HTTPException(status_code=502, detail="Image upload failed")

    if not result.get("secure_url"):
        raise HTTPException(status_code=502, detail="Image upload failed")

    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id"),
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "bytes": result.get("bytes")
    }


@router.delete("/delete-image")
def delete_image(
    public_id: str = Query(..., description="Cloudinary public ID, which may contain slashes"),
    current_user: str = Depends(get_current_user)
):
    """Delete an image from Cloudinary (Admin only)

    public_id is a query parameter because Cloudinary IDs such as
    'portfolio/projects/abc123' cannot travel in a single path segment.
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
    except Exception:
        logger.exception("Cloudinary delete failed")
        raise HTTPException(status_code=502, detail="Image delete failed")

    if result.get("result") != "ok":
        raise HTTPException(status_code=404, detail="Image not found")

    return {"message": "Image deleted successfully"}

# ============ CONTACT MANAGEMENT ============
class ReplyEmail(BaseModel):
    to_email: EmailStr
    subject: str
    message: str
    contact_id: int

@router.get("/contacts", response_model=List[ContactResponse])
def admin_get_contacts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return get_contacts(db, skip, limit)

@router.get("/contacts/{contact_id}", response_model=ContactResponse)
def admin_get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    contact = get_contact(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.patch("/contacts/{contact_id}/read")
def admin_mark_contact_read(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    contact = mark_contact_read(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact marked as read"}

@router.delete("/contacts/{contact_id}")
def admin_delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    deleted = delete_contact(db, contact_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}

@router.post("/contacts/reply")
def admin_reply_to_contact(
    reply_data: ReplyEmail,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    contact = get_contact(db, reply_data.contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_USER
        msg['To'] = reply_data.to_email
        msg['Subject'] = reply_data.subject
        
        body = f"""Hello {contact.name},

{reply_data.message}

Best regards,
{settings.ADMIN_NAME}
"""

        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)

        mark_contact_read(db, reply_data.contact_id)

        return {"message": "Reply sent successfully"}

    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to send reply email")
        # Do not leak SMTP host/credentials details to the client.
        raise HTTPException(status_code=502, detail="Failed to send email")

# ============ PROJECT MANAGEMENT ============
@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def admin_create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Create a new project (Admin only)"""
    return create_project(db, project)

@router.get("/projects", response_model=List[ProjectResponse])
def admin_get_all_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get all projects (Admin only)"""
    return get_projects(db, skip, limit)

@router.get("/projects/{project_id}", response_model=ProjectResponse)
def admin_get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get a specific project (Admin only)"""
    project = get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/projects/{project_id}", response_model=ProjectResponse)
def admin_update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Update a project (Admin only)"""
    updated_project = update_project(db, project_id, project_update.model_dump(exclude_unset=True))
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project

@router.delete("/projects/{project_id}")
def admin_delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Delete a project (Admin only)"""
    deleted = delete_project(db, project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}