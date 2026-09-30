from datetime import datetime, timedelta, timezone
from typing import Optional
import secrets
import time

from jose import JWTError, jwt
import bcrypt
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings

security = HTTPBearer(auto_error=False)

# bcrypt only considers the first 72 bytes of a password.
BCRYPT_MAX_BYTES = 72


# ============ PASSWORDS ============
def hash_password(password: str) -> str:
    """Hash a plaintext password for storage in ADMIN_PASSWORD_HASH."""
    encoded = password.encode("utf-8")
    if len(encoded) > BCRYPT_MAX_BYTES:
        encoded = encoded[:BCRYPT_MAX_BYTES]
    return bcrypt.hashpw(encoded, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    encoded = plain_password.encode("utf-8")
    if len(encoded) > BCRYPT_MAX_BYTES:
        encoded = encoded[:BCRYPT_MAX_BYTES]
    try:
        return bcrypt.checkpw(encoded, hashed_password.encode("utf-8"))
    except (ValueError, TypeError):
        # Malformed hash string.
        return False


def verify_admin_password(plain_password: str) -> bool:
    """Verify the admin password against ADMIN_PASSWORD_HASH.

    Falls back to constant-time comparison against a plaintext ADMIN_PASSWORD so
    existing .env files keep working, but that fallback is deprecated: generate
    a hash and set ADMIN_PASSWORD_HASH instead.
    """
    if settings.ADMIN_PASSWORD_HASH:
        hashed = settings.ADMIN_PASSWORD_HASH
        # A misconfigured hash must not silently degrade into "wrong password".
        if not hashed.startswith(("$2a$", "$2b$", "$2y$")):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Admin password hash is not a valid bcrypt hash",
            )
        return verify_password(plain_password, hashed)

    if settings.ADMIN_PASSWORD:
        return secrets.compare_digest(plain_password, settings.ADMIN_PASSWORD)

    return False


# ============ RATE LIMITING ============
# In-process, fixed-window limiter. Enough to blunt online password guessing on a
# single worker. A multi-worker or multi-instance deployment needs shared state
# (Redis) for this to hold across processes.
_login_attempts: dict[str, list[float]] = {}
LOGIN_WINDOW_SECONDS = 15 * 60
LOGIN_MAX_ATTEMPTS = settings.LOGIN_MAX_ATTEMPTS


def _client_key(request: Request, username: str) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    return f"{ip}|{username.lower()}"


def enforce_login_rate_limit(request: Request, username: str) -> None:
    """Raise 429 when a client exceeds LOGIN_MAX_ATTEMPTS in the window."""
    key = _client_key(request, username)
    now = time.monotonic()
    window_start = now - LOGIN_WINDOW_SECONDS

    attempts = [t for t in _login_attempts.get(key, []) if t >= window_start]

    if len(attempts) >= LOGIN_MAX_ATTEMPTS:
        retry_after = int(window_start + LOGIN_WINDOW_SECONDS - now) + 1
        _login_attempts[key] = attempts
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Try again later.",
            headers={"Retry-After": str(max(retry_after, 1))},
        )

    _login_attempts[key] = attempts


def record_login_attempt(request: Request, username: str) -> None:
    key = _client_key(request, username)
    now = time.monotonic()
    window_start = now - LOGIN_WINDOW_SECONDS
    attempts = [t for t in _login_attempts.get(key, []) if t >= window_start]
    attempts.append(now)
    _login_attempts[key] = attempts


def clear_login_attempts(request: Request, username: str) -> None:
    _login_attempts.pop(_client_key(request, username), None)


# ============ TOKENS ============
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> str:
    """Require a valid admin bearer token.

    Raises 401 when the token is missing, malformed, expired, or issued for a
    user other than the configured admin.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = verify_token(credentials.credentials)
    username = payload.get("sub")
    if not username or username != settings.ADMIN_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username
