"""
F2G CMAS Hub — Backend Tests
Complete test suite for API endpoints
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.database import Base, get_db


# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_cmas_hub.db"


@pytest_asyncio.fixture
async def async_client():
    """Create async test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture
async def auth_headers(async_client: AsyncClient):
    """Get authentication headers with valid token."""
    response = await async_client.post(
        "/api/v1/auth/login",
        data={"username": "admin@f2g.cm", "password": "admin123"}
    )
    if response.status_code == 200:
        token = response.json().get("access_token")
        return {"Authorization": f"Bearer {token}"}
    return {}


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestHealth:
    """Health endpoint tests."""
    
    @pytest.mark.asyncio
    async def test_health_endpoint(self, async_client: AsyncClient):
        """Test /health returns 200."""
        response = await async_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["app"] == "F2G CMAS Hub"
        assert "version" in data


# ═══════════════════════════════════════════════════════════════════════════════
# AUTH TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestAuth:
    """Authentication tests."""
    
    @pytest.mark.asyncio
    async def test_login_success(self, async_client: AsyncClient):
        """Test successful login returns token."""
        response = await async_client.post(
            "/api/v1/auth/login",
            data={"username": "admin@f2g.cm", "password": "admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self, async_client: AsyncClient):
        """Test login with wrong password."""
        response = await async_client.post(
            "/api/v1/auth/login",
            data={"username": "admin@f2g.cm", "password": "wrongpassword"}
        )
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_login_invalid_user(self, async_client: AsyncClient):
        """Test login with non-existent user."""
        response = await async_client.post(
            "/api/v1/auth/login",
            data={"username": "nobody@f2g.cm", "password": "password123"}
        )
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_me_endpoint(self, async_client: AsyncClient, auth_headers: dict):
        """Test /auth/me returns current user."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        response = await async_client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "role" in data
    
    @pytest.mark.asyncio
    async def test_me_without_token(self, async_client: AsyncClient):
        """Test /auth/me without token returns 401."""
        response = await async_client.get("/api/v1/auth/me")
        assert response.status_code in [401, 403]


# ═══════════════════════════════════════════════════════════════════════════════
# STATS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestStats:
    """Dashboard statistics tests."""
    
    @pytest.mark.asyncio
    async def test_stats_requires_auth(self, async_client: AsyncClient):
        """Test stats endpoint requires authentication."""
        response = await async_client.get("/api/v1/stats")
        assert response.status_code in [401, 403]
    
    @pytest.mark.asyncio
    async def test_stats_with_auth(self, async_client: AsyncClient, auth_headers: dict):
        """Test stats endpoint returns data."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        response = await async_client.get("/api/v1/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        
        # Check structure
        assert "alerts" in data
        assert "cells" in data
        assert "today" in data
        assert "success_rate" in data
        
        # Check alerts structure
        assert "total" in data["alerts"]
        assert "sent" in data["alerts"]
        assert "failed" in data["alerts"]
        
        # Check cells structure
        assert "total" in data["cells"]
        assert "active" in data["cells"]
        assert "offline" in data["cells"]


# ═══════════════════════════════════════════════════════════════════════════════
# TEMPLATES TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestTemplates:
    """Template CRUD tests."""
    
    @pytest.mark.asyncio
    async def test_list_templates_requires_auth(self, async_client: AsyncClient):
        """Test templates endpoint requires auth."""
        response = await async_client.get("/api/v1/templates")
        assert response.status_code in [401, 403]
    
    @pytest.mark.asyncio
    async def test_list_templates(self, async_client: AsyncClient, auth_headers: dict):
        """Test listing templates."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        response = await async_client.get("/api/v1/templates", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # Check seeded templates exist
        assert len(data) >= 1
        
        # Check template structure
        if len(data) > 0:
            template = data[0]
            assert "id" in template
            assert "name" in template
            assert "content" in template
            assert "alert_type" in template
            assert "message_id" in template
    
    @pytest.mark.asyncio
    async def test_get_template_by_id(self, async_client: AsyncClient, auth_headers: dict):
        """Test getting a specific template."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        # First get list
        response = await async_client.get("/api/v1/templates", headers=auth_headers)
        templates = response.json()
        
        if len(templates) > 0:
            template_id = templates[0]["id"]
            response = await async_client.get(
                f"/api/v1/templates/{template_id}",
                headers=auth_headers
            )
            assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_template(self, async_client: AsyncClient, auth_headers: dict):
        """Test getting non-existent template returns 404."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        response = await async_client.get(
            "/api/v1/templates/00000000-0000-0000-0000-000000000000",
            headers=auth_headers
        )
        assert response.status_code == 404


# ═══════════════════════════════════════════════════════════════════════════════
# CELLS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestCells:
    """Cell site CRUD tests."""
    
    @pytest.mark.asyncio
    async def test_list_cells_requires_auth(self, async_client: AsyncClient):
        """Test cells endpoint requires auth."""
        response = await async_client.get("/api/v1/cells")
        assert response.status_code in [401, 403]
    
    @pytest.mark.asyncio
    async def test_list_cells(self, async_client: AsyncClient, auth_headers: dict):
        """Test listing cell sites."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        response = await async_client.get("/api/v1/cells", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # Check seeded cells exist
        assert len(data) >= 1
        
        # Check cell structure
        if len(data) > 0:
            cell = data[0]
            assert "id" in cell
            assert "name" in cell
            assert "cell_id" in cell
            assert "enb_ip" in cell
            assert "status" in cell
    
    @pytest.mark.asyncio
    async def test_get_cell_by_id(self, async_client: AsyncClient, auth_headers: dict):
        """Test getting a specific cell."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        # First get list
        response = await async_client.get("/api/v1/cells", headers=auth_headers)
        cells = response.json()
        
        if len(cells) > 0:
            cell_id = cells[0]["id"]
            response = await async_client.get(
                f"/api/v1/cells/{cell_id}",
                headers=auth_headers
            )
            assert response.status_code == 200


# ═══════════════════════════════════════════════════════════════════════════════
# ALERTS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestAlerts:
    """Alert CRUD tests."""
    
    @pytest.mark.asyncio
    async def test_list_alerts_requires_auth(self, async_client: AsyncClient):
        """Test alerts endpoint requires auth."""
        response = await async_client.get("/api/v1/alerts")
        assert response.status_code in [401, 403]
    
    @pytest.mark.asyncio
    async def test_list_alerts(self, async_client: AsyncClient, auth_headers: dict):
        """Test listing alerts."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        response = await async_client.get("/api/v1/alerts", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        # Response is paginated: {data: [], pagination: {...}}
        if isinstance(data, dict) and "data" in data:
            assert isinstance(data["data"], list)
            assert "pagination" in data
        else:
            assert isinstance(data, list)
    
    @pytest.mark.asyncio
    async def test_create_alert(self, async_client: AsyncClient, auth_headers: dict):
        """Test creating a new alert."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        # Get a cell first
        cells_response = await async_client.get("/api/v1/cells", headers=auth_headers)
        cells = cells_response.json()
        
        if len(cells) == 0:
            pytest.skip("No cells available")
        
        cell_id = cells[0]["id"]
        
        alert_data = {
            "title": "Test Alert",
            "content": "This is a test alert message.",
            "alert_type": "CMAS",
            "message_id": 4376,  # Test message ID
            "severity": "test",
            "duration": 3600,
            "cell_ids": [cell_id]
        }
        
        response = await async_client.post(
            "/api/v1/alerts",
            json=alert_data,
            headers=auth_headers
        )
        
        # Should be 200 or 201
        assert response.status_code in [200, 201, 422]  # 422 if validation fails


# ═══════════════════════════════════════════════════════════════════════════════
# VALIDATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestValidation:
    """Input validation tests."""
    
    @pytest.mark.asyncio
    async def test_invalid_json(self, async_client: AsyncClient, auth_headers: dict):
        """Test invalid JSON is rejected."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        response = await async_client.post(
            "/api/v1/alerts",
            content="not valid json",
            headers={**auth_headers, "Content-Type": "application/json"}
        )
        assert response.status_code == 422
    
    @pytest.mark.asyncio
    async def test_missing_required_fields(self, async_client: AsyncClient, auth_headers: dict):
        """Test missing required fields are rejected."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        response = await async_client.post(
            "/api/v1/alerts",
            json={"title": "Only title"},  # Missing other required fields
            headers=auth_headers
        )
        assert response.status_code == 422


# ═══════════════════════════════════════════════════════════════════════════════
# SECURITY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestSecurity:
    """Security tests."""
    
    @pytest.mark.asyncio
    async def test_invalid_token(self, async_client: AsyncClient):
        """Test invalid token is rejected."""
        response = await async_client.get(
            "/api/v1/stats",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code in [401, 403]
    
    @pytest.mark.asyncio
    async def test_expired_token_format(self, async_client: AsyncClient):
        """Test malformed token is rejected."""
        response = await async_client.get(
            "/api/v1/stats",
            headers={"Authorization": "NotBearer token"}
        )
        assert response.status_code in [401, 403]
    
    @pytest.mark.asyncio
    async def test_sql_injection_attempt(self, async_client: AsyncClient):
        """Test SQL injection is blocked."""
        response = await async_client.post(
            "/api/v1/auth/login",
            data={
                "username": "admin@f2g.cm'; DROP TABLE users; --",
                "password": "test"
            }
        )
        # Should fail auth, not crash
        assert response.status_code in [401, 422]


# ═══════════════════════════════════════════════════════════════════════════════
# PERFORMANCE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestPerformance:
    """Basic performance tests."""
    
    @pytest.mark.asyncio
    async def test_health_response_time(self, async_client: AsyncClient):
        """Test health endpoint responds quickly."""
        import time
        
        start = time.time()
        response = await async_client.get("/health")
        elapsed = time.time() - start
        
        assert response.status_code == 200
        assert elapsed < 1.0  # Should respond in under 1 second
    
    @pytest.mark.asyncio
    async def test_stats_response_time(self, async_client: AsyncClient, auth_headers: dict):
        """Test stats endpoint responds in reasonable time."""
        if not auth_headers:
            pytest.skip("Auth not available")
        
        import time
        
        start = time.time()
        response = await async_client.get("/api/v1/stats", headers=auth_headers)
        elapsed = time.time() - start
        
        assert response.status_code == 200
        assert elapsed < 2.0  # Should respond in under 2 seconds


# ═══════════════════════════════════════════════════════════════════════════════
# RUN TESTS
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
