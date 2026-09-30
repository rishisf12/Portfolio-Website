from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from app.database import get_db
from app.crud import create_contact, get_contacts, get_contact, mark_contact_read
from app.schemas import ContactCreate, ContactResponse
from app.core.security import get_current_user

router = APIRouter()

# Public: anyone may submit a contact message.
@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_new_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """Submit a new contact message"""
    return create_contact(db, contact)


# Everything below reads or mutates stored submissions, so it requires the admin
# token. These routes previously had no auth and exposed visitor contact details.
@router.get("/", response_model=List[ContactResponse])
def get_all_contacts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Get all contact messages (admin only)"""
    return get_contacts(db, skip, limit)


@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact_by_id(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Get a specific contact message (admin only)"""
    contact = get_contact(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.patch("/{contact_id}/read", response_model=ContactResponse)
def mark_contact_as_read(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Mark a contact message as read (admin only)"""
    contact = mark_contact_read(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact
