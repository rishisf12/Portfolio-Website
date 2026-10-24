from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.auth.auth import create_access_token, verify_password
from app.core.config import settings
from app.core.database import get_session
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(username: str, password: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.username == settings.ADMIN_USERNAME:
        access_token = create_access_token({"sub": user.username, "is_admin": True})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Admin access required")
