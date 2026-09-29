"""
F2G CMAS Hub - API Router
"""
from fastapi import APIRouter

from app.api.endpoints import auth, alerts, templates, cells, stats

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(alerts.router)
api_router.include_router(templates.router)
api_router.include_router(cells.router)
api_router.include_router(stats.router)
