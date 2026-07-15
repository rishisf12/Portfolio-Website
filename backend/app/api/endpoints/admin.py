from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlmodel import Session
from typing import List
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import cloudinary
import cloudinary.uploader
import cloudinary.api

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
@router.post("/upload-image")
def upload_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    """Upload an image to Cloudinary (Admin only)"""
    try:
        # Validate file type
        allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp']
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file.content_type} not allowed. Allowed types: {', '.join(allowed_types)}"
            )
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file.file,
            folder="portfolio/projects",
            transformation=[
                {"width": 800, "height": 600, "crop": "limit"},
                {"quality": "auto:good"}
            ]
        )
        
        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "width": result.get("width"),
            "height": result.get("height"),
            "format": result.get("format"),
            "bytes": result.get("bytes")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.delete("/delete-image/{public_id}")
def delete_image(
    public_id: str,
    current_user: str = Depends(get_current_user)
):
    """Delete an image from Cloudinary (Admin only)"""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {"message": "Image deleted successfully", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

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
        
        body = f"""
        Hello {contact.name},
        
        {reply_data.message}
        
        Best regards,
        John Doe
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        mark_contact_read(db, reply_data.contact_id)
        
        return {"message": "Reply sent successfully"}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )

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