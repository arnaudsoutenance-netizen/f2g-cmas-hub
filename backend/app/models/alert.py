"""
F2G CMAS Hub - Alert Model
"""
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum

from app.core.database import Base


class AlertType(str, enum.Enum):
    CMAS = "CMAS"
    ETWS = "ETWS"


class AlertStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    SENDING = "SENDING"
    SENT = "SENT"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_type = Column(SQLEnum(AlertType), nullable=False)
    message_id = Column(Integer, nullable=False)  # 4370-4399 for CMAS, 4352-4359 for ETWS
    content = Column(Text, nullable=False)
    status = Column(SQLEnum(AlertStatus), default=AlertStatus.DRAFT, nullable=False)
    
    # Scheduling
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    duration = Column(Integer, default=3600)  # Duration in seconds
    
    # Metadata
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Foreign keys
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    template_id = Column(String(36), ForeignKey("templates.id"), nullable=True)
    
    # Relationships
    created_by_user = relationship("User", back_populates="alerts")
    template = relationship("Template", back_populates="alerts")
    cells = relationship("AlertCell", back_populates="alert", cascade="all, delete-orphan")
    logs = relationship("AlertLog", back_populates="alert", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Alert {self.id} - {self.alert_type} - {self.status}>"


class AlertCell(Base):
    """Association between alerts and cells."""
    __tablename__ = "alert_cells"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_id = Column(String(36), ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False)
    cell_id = Column(String(36), ForeignKey("cell_sites.id"), nullable=False)
    status = Column(String(20), default="pending")  # pending, sent, failed
    sent_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relationships
    alert = relationship("Alert", back_populates="cells")
    cell = relationship("CellSite", back_populates="alerts")


class AlertLog(Base):
    """Logs for alert actions."""
    __tablename__ = "alert_logs"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_id = Column(String(36), ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(50), nullable=False)  # CREATED, SCHEDULED, SENDING, SENT, FAILED, CANCELLED
    status = Column(String(20), nullable=False)  # success, error, info
    message = Column(Text, nullable=True)
    extra_data = Column(JSON, nullable=True)  # Renamed from 'metadata' (reserved by SQLAlchemy)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    alert = relationship("Alert", back_populates="logs")
