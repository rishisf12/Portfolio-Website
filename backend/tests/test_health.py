import pytest
from fastapi.testclient import TestClient


class TestHealthAndRoot:
    """Tests for health check and root endpoints."""

    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint returns API info."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Welcome to Portfolio API"
        assert data["docs"] == "/docs"
        assert data["redoc"] == "/redoc"

    def test_health_check(self, client: TestClient):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestOpenAPIDocs:
    """Tests for OpenAPI documentation endpoints."""

    def test_docs_endpoint(self, client: TestClient):
        """Test Swagger UI docs endpoint."""
        response = client.get("/docs")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_redoc_endpoint(self, client: TestClient):
        """Test ReDoc endpoint."""
        response = client.get("/redoc")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_openapi_json(self, client: TestClient):
        """Test OpenAPI JSON spec."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert data["info"]["title"] == "Portfolio API"
        assert "paths" in data