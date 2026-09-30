from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import create_db_and_tables
from app.api.router import api_router
from app.core.config import settings, INSECURE_DEFAULT_SECRET


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    validate_config()
    create_db_and_tables()
    yield
    # Shutdown


def validate_config() -> None:
    """Fail fast on configuration that is unsafe outside local development."""
    problems = []

    if settings.is_production:
        if settings.SECRET_KEY == INSECURE_DEFAULT_SECRET or not settings.SECRET_KEY.strip():
            problems.append("SECRET_KEY must be set to a unique value in production")

        if not settings.ADMIN_PASSWORD_HASH:
            problems.append(
                "ADMIN_PASSWORD_HASH must be set in production "
                "(generate one with: python -m app.core.security_hash)"
            )

        if not settings.CLOUDINARY_API_SECRET:
            problems.append("CLOUDINARY_API_SECRET must be set in production")

    if not settings.ADMIN_PASSWORD_HASH and not settings.ADMIN_PASSWORD:
        problems.append("No admin password configured: set ADMIN_PASSWORD_HASH")

    if problems:
        raise RuntimeError("Refusing to start:\n  - " + "\n  - ".join(problems))


app = FastAPI(
    title="Portfolio API",
    description="Backend API for Portfolio Website",
    version="1.0.0",
    lifespan=lifespan,
)

# Origins come from CORS_ORIGINS in the environment so deployments do not need
# a code change.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "Welcome to Portfolio API",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
