import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Placeholder used only when no SECRET_KEY is configured. Startup validation in
# main.py refuses to serve in production with this value.
INSECURE_DEFAULT_SECRET = "your-super-secret-key-change-in-production-123456789"


class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres123@localhost:5432/portfolio_db")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", INSECURE_DEFAULT_SECRET)
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # Deployment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Login throttling
    LOGIN_MAX_ATTEMPTS: int = int(os.getenv("LOGIN_MAX_ATTEMPTS", "5"))

    # Admin credentials
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    # Preferred: a bcrypt hash produced by `python -m app.core.security_hash ADMIN_PASSWORD`
    ADMIN_PASSWORD_HASH: str = os.getenv("ADMIN_PASSWORD_HASH", "")
    # Deprecated: plaintext fallback, still honoured for existing .env files
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "")
    # Name used in the contact-reply signature
    ADMIN_NAME: str = os.getenv("ADMIN_NAME", "the site owner")

    # CORS - comma-separated list of allowed frontend origins
    CORS_ORIGINS: list = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174",
        ).split(",")
        if origin.strip()
    ]

    # Email Settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")

    # Cloudinary Settings
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "").strip()
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "").strip()
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "").strip()

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() in {"production", "prod"}


settings = Settings()
