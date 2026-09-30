from fastapi import APIRouter, HTTPException, Request, status, Depends
from pydantic import BaseModel

from app.core.security import (
    create_access_token,
    enforce_login_rate_limit,
    get_current_user,
    record_login_attempt,
    clear_login_attempts,
    verify_admin_password,
)
from app.core.config import settings

router = APIRouter()

INVALID_CREDENTIALS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    username: str


@router.post("/login", response_model=LoginResponse)
def login(request: Request, request_data: LoginRequest):
    enforce_login_rate_limit(request, request_data.username)

    if not verify_admin_password(request_data.password):
        record_login_attempt(request, request_data.username)
        raise INVALID_CREDENTIALS

    clear_login_attempts(request, request_data.username)

    access_token = create_access_token(data={"sub": settings.ADMIN_USERNAME})
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        username=settings.ADMIN_USERNAME,
    )


@router.get("/verify")
def verify_token_endpoint(current_user: str = Depends(get_current_user)):
    """Validate the bearer token. 401 when missing, malformed, or expired."""
    return {"valid": True, "username": current_user}
