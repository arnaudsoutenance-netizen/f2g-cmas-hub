"""
F2G CMAS Hub - FastAPI Application
Cell Broadcast Emergency Alert System for Cameroon
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.core.database import init_db, close_db
from app.api import api_router


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting F2G CMAS Hub...")
    await init_db()
    logger.info("Database initialized")
    
    # Seed initial data if needed
    await seed_initial_data()
    
    yield
    
    # Shutdown
    logger.info("Shutting down F2G CMAS Hub...")
    await close_db()


async def seed_initial_data():
    """Seed initial data (templates, admin user, test cells)."""
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlalchemy import select
    from app.core.database import async_session
    from app.core.security import get_password_hash
    from app.models import User, Template, CellSite, UserRole, AlertType
    
    async with async_session() as db:
        # Check if admin exists
        result = await db.execute(select(User).where(User.email == "admin@f2g.cm"))
        if not result.scalar_one_or_none():
            # Create admin user
            admin = User(
                email="admin@f2g.cm",
                name="Admin F2G",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN,
            )
            db.add(admin)
            logger.info("Created admin user: admin@f2g.cm")
        
        # Check if templates exist
        result = await db.execute(select(Template))
        if not result.scalars().first():
            # Create default templates
            templates = [
                Template(
                    name="Alerte Présidentielle",
                    category="emergency",
                    alert_type=AlertType.CMAS,
                    message_id=4370,
                    content="ALERTE NATIONALE: [Insérer message]. Suivez les instructions des autorités.",
                    default_duration=3600,
                ),
                Template(
                    name="AMBER Alert - Enfant disparu",
                    category="amber",
                    alert_type=AlertType.CMAS,
                    message_id=4375,
                    content="ALERTE AMBER: [NOM] [AGE] ans. Vu dernièrement à [LIEU]. Contact: 117.",
                    default_duration=7200,
                ),
                Template(
                    name="Test Mensuel",
                    category="test",
                    alert_type=AlertType.CMAS,
                    message_id=4376,
                    content="TEST MENSUEL DU SYSTÈME D'ALERTE NATIONAL. Aucune action requise. Ceci est un test.",
                    default_duration=1800,
                ),
                Template(
                    name="Alerte Séisme",
                    category="earthquake",
                    alert_type=AlertType.ETWS,
                    message_id=4352,
                    content="ALERTE SÉISME: Tremblement de terre détecté. Abritez-vous sous une table solide.",
                    default_duration=3600,
                ),
                Template(
                    name="Alerte Inondation",
                    category="severe",
                    alert_type=AlertType.CMAS,
                    message_id=4373,
                    content="ALERTE INONDATION: Risque de crue dans votre zone. Évitez les déplacements.",
                    default_duration=7200,
                ),
            ]
            for t in templates:
                db.add(t)
            logger.info(f"Created {len(templates)} default templates")
        
        # Check if cells exist
        result = await db.execute(select(CellSite))
        if not result.scalars().first():
            # Create test cells
            cells = [
                CellSite(
                    name="Yaoundé Centre",
                    cell_id="YDE-001",
                    enb_ip="192.168.1.101",
                    enb_port=22,
                    location="3.8480° N, 11.5021° E",
                    status="active",
                ),
                CellSite(
                    name="Yaoundé Nord",
                    cell_id="YDE-002",
                    enb_ip="192.168.1.102",
                    enb_port=22,
                    location="3.8680° N, 11.5121° E",
                    status="active",
                ),
                CellSite(
                    name="Douala Centre",
                    cell_id="DLA-001",
                    enb_ip="192.168.2.101",
                    enb_port=22,
                    location="4.0511° N, 9.7679° E",
                    status="active",
                ),
                CellSite(
                    name="Douala Port",
                    cell_id="DLA-002",
                    enb_ip="192.168.2.102",
                    enb_port=22,
                    location="4.0311° N, 9.7079° E",
                    status="offline",
                ),
            ]
            for c in cells:
                db.add(c)
            logger.info(f"Created {len(cells)} test cell sites")
        
        await db.commit()


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    ## F2G CMAS Hub - Cell Broadcast Emergency Alert System
    
    Plateforme de gestion des alertes Cell Broadcast pour le Cameroun.
    
    ### Fonctionnalités
    
    * 🚨 **Alertes CMAS/ETWS** - Création et envoi d'alertes d'urgence
    * 📋 **Templates** - Modèles d'alertes pré-configurés
    * 📡 **Cellules** - Gestion des sites cellulaires eNodeB
    * ⏰ **Programmation** - Planification des alertes
    * 📊 **Statistiques** - Dashboard temps réel
    
    ### Authentification
    
    Utilisez le endpoint `/api/v1/auth/login` pour obtenir un token JWT.
    
    ---
    *F2G Solutions & KFOKAM48 Academy - Cameroun*
    """,
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/health", tags=["Health"])
async def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "api_prefix": settings.API_PREFIX,
    }
