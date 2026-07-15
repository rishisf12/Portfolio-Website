from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List

from app.database import get_db
from app.crud import create_contact, get_contacts, get_contact, mark_contact_read
from app.schemas import ContactCreate, ContactResponse

router = APIRouter()

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_new_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """Submit a new contact message"""
    return create_contact(db, contact)

@router.get("/", response_model=List[ContactResponse])
def get_all_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all contact messages (admin only - protected in production)"""
    return get_contacts(db, skip, limit)

@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact_by_id(contact_id: int, db: Session = Depends(get_db)):
    """Get a specific contact message"""
    contact = get_contact(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.patch("/{contact_id}/read", response_model=ContactResponse)
def mark_contact_as_read(contact_id: int, db: Session = Depends(get_db)):
    """Mark a contact message as read"""
    contact = mark_contact_read(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact