from fastapi import APIRouter
from app.api.endpoints import contact, projects, auth, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(contact.router, prefix="/contacts", tags=["contacts"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])