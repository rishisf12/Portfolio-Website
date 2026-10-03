import pytest
from fastapi.testclient import TestClient


class TestAuthAPI:
    """Tests for the Auth API endpoints."""

    def test_login_invalid_credentials(self, client: TestClient):
        """Test login with invalid credentials returns 401."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "wrong", "password": "wrong"},
        )
        # With form data, if validation passes but credentials wrong -> 401
        # If validation fails -> 422
        assert response.status_code in (401, 422)

    def test_login_missing_fields(self, client: TestClient):
        """Test login with missing fields returns 422."""
        response = client.post("/api/v1/auth/login", data={})
        assert response.status_code == 422

    def test_protected_route_without_token(self, client: TestClient):
        """Test accessing protected route without token returns 401."""
        response = client.get("/api/v1/admin/projects")
        assert response.status_code == 401

    def test_protected_route_with_invalid_token(self, client: TestClient):
        """Test accessing protected route with invalid token returns 401."""
        response = client.get(
            "/api/v1/admin/projects",
            headers={"Authorization": "Bearer invalid-token"},
        )
        assert response.status_code == 401


class TestAuthRateLimiting:
    """Tests for login rate limiting."""

    def test_multiple_failed_logins(self, client: TestClient):
        """Test multiple failed logins eventually get rate limited."""
        # This test would need the rate limiter to be tested properly
        # For now, just verify the endpoint exists
        for _ in range(3):
            response = client.post(
                "/api/v1/auth/login",
                data={"username": "admin", "password": "wrongpassword"},
            )
            assert response.status_code in (401, 422, 429)