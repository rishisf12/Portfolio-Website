import os
import sys
from collections.abc import AsyncGenerator, Generator

# Set test environment variables BEFORE importing app
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only-1234567890123456"
os.environ["ADMIN_PASSWORD_HASH"] = "$2b$12$testhashforci"
os.environ["ENVIRONMENT"] = "test"
os.environ["CLOUDINARY_API_SECRET"] = "test"
os.environ["DATABASE_URL"] = "sqlite://"

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database import get_db
from app.models import Contact, Project


# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite://"


@pytest.fixture(scope="session")
def engine():
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def session(engine) -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


@pytest.fixture(scope="function")
def client(session: Session) -> Generator[TestClient, None, None]:
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
async def async_client(session: Session) -> AsyncGenerator[AsyncClient, None]:
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()


# Test data fixtures
@pytest.fixture
def sample_contact():
    return {
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Hello, this is a test message.",
    }


@pytest.fixture
def sample_project():
    return {
        "title": "Test Project",
        "description": "A test project description",
        "image": "https://example.com/image.jpg",
        "tags": ["python", "fastapi", "react"],
        "live_demo_url": "https://demo.example.com",
        "github_url": "https://github.com/test/project",
        "is_featured": True,
    }


@pytest.fixture
def created_contact(client: TestClient, sample_contact: dict):
    response = client.post("/api/v1/contacts/", json=sample_contact)
    assert response.status_code == 201
    return response.json()


@pytest.fixture
def created_project(client: TestClient, sample_project: dict, session: Session):
    # Create project directly in database for testing (simpler than auth)
    from app.crud import create_project
    from app.schemas import ProjectCreate
    
    project_data = ProjectCreate(**sample_project)
    project = create_project(session, project_data)
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "image": project.image,
        "tags": project.tags,
        "live_demo_url": project.live_demo_url,
        "github_url": project.github_url,
        "is_featured": project.is_featured,
        "created_at": project.created_at.isoformat() if project.created_at else None,
    }