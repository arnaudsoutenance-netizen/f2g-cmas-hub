"""
F2G CMAS Hub - Configuration
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional, List
import os


class Settings(BaseSettings):
    """Application settings."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # App
    APP_NAME: str = "F2G CMAS Hub"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # API
    API_PREFIX: str = "/api/v1"
    
    # Database - Default to SQLite
    DATABASE_URL: str = "sqlite+aiosqlite:///./cmas_hub.db"
    
    # Redis (optional, for production)
    REDIS_URL: Optional[str] = None
    
    # JWT Auth
    SECRET_KEY: str = "f2g-cmas-hub-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours
    
    # eNodeB Configuration
    ENB_DEFAULT_CONFIG_PATH: str = "/etc/srsenb/sib.conf"
    ENB_SSH_TIMEOUT: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
    ]
    # Deployed frontends (production + Vercel previews of the f2g-cmas-hub project)
    CORS_ORIGIN_REGEX: Optional[str] = (
        r"https://.*\.vercel\.app"
        r"|https://.*\.onrender\.com"
    )


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
