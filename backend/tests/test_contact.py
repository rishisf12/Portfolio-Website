import pytest
from fastapi.testclient import TestClient


class TestContactAPI:
    """Tests for the Contact API endpoints."""

    def test_create_contact(self, client: TestClient, sample_contact: dict):
        """Test creating a new contact message."""
        response = client.post("/api/v1/contacts/", json=sample_contact)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_contact["name"]
        assert data["email"] == sample_contact["email"]
        assert data["message"] == sample_contact["message"]
        assert data["is_read"] is False
        assert "id" in data
        assert "created_at" in data

    def test_create_contact_invalid_email(self, client: TestClient):
        """Test creating contact with invalid email fails validation."""
        invalid_contact = {
            "name": "John Doe",
            "email": "not-an-email",
            "message": "Test message",
        }
        response = client.post("/api/v1/contacts/", json=invalid_contact)
        assert response.status_code == 422

    def test_create_contact_missing_fields(self, client: TestClient):
        """Test creating contact with missing required fields fails."""
        response = client.post("/api/v1/contacts/", json={"name": "John"})
        assert response.status_code == 422

    def test_get_contacts_unauthorized(self, client: TestClient):
        """Test getting contacts without auth returns 401."""
        response = client.get("/api/v1/contacts/")
        assert response.status_code == 401

    def test_get_contact_by_id_unauthorized(self, client: TestClient, created_contact: dict):
        """Test getting single contact without auth returns 401."""
        response = client.get(f"/api/v1/contacts/{created_contact['id']}")
        assert response.status_code == 401

    def test_mark_contact_read_unauthorized(self, client: TestClient, created_contact: dict):
        """Test marking contact as read without auth returns 401."""
        response = client.patch(f"/api/v1/contacts/{created_contact['id']}/read")
        assert response.status_code == 401

    def test_delete_contact_unauthorized(self, client: TestClient, created_contact: dict):
        """Test deleting contact without auth returns 401."""
        response = client.delete(f"/api/v1/admin/contacts/{created_contact['id']}")
        assert response.status_code == 401


class TestContactValidation:
    """Tests for contact input validation."""

    def test_contact_name_max_length(self, client: TestClient):
        """Test contact name max length validation."""
        long_name = "a" * 101
        response = client.post(
            "/api/v1/contacts/",
            json={"name": long_name, "email": "test@example.com", "message": "Test"},
        )
        assert response.status_code == 422

    def test_contact_email_max_length(self, client: TestClient):
        """Test contact email max length validation."""
        long_email = "a" * 95 + "@example.com"
        response = client.post(
            "/api/v1/contacts/",
            json={"name": "Test", "email": long_email, "message": "Test"},
        )
        assert response.status_code == 422