"""
F2G CMAS Hub - CellSite Model
"""
from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.core.database import Base


class CellSite(Base):
    __tablename__ = "cell_sites"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    cell_id = Column(String(50), unique=True, nullable=False)  # e.g., "YDE-001"
    
    # eNodeB connection
    enb_ip = Column(String(45), nullable=False)  # IPv4 or IPv6
    enb_port = Column(Integer, default=22)
    enb_username = Column(String(100), default="root")
    enb_config_path = Column(String(500), default="/etc/srsenb/sib.conf")
    
    # Location
    location = Column(String(255), nullable=True)  # e.g., "3.8480° N, 11.5021° E"
    
    # Status
    status = Column(String(20), default="active")  # active, offline, maintenance
    last_seen = Column(DateTime(timezone=True), nullable=True)
    last_health_check = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    alerts = relationship("AlertCell", back_populates="cell")
    
    def __repr__(self):
        return f"<CellSite {self.name} ({self.cell_id})>"
