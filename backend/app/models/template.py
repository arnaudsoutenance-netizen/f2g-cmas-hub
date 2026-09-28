"""
F2G CMAS Hub - Template Model
"""
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from app.core.database import Base
from app.models.alert import AlertType


class Template(Base):
    __tablename__ = "templates"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # emergency, extreme, severe, amber, test, earthquake, etc.
    alert_type = Column(SQLEnum(AlertType), nullable=False)
    message_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    default_duration = Column(Integer, default=3600)  # seconds
    is_active = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    alerts = relationship("Alert", back_populates="template")
    
    def __repr__(self):
        return f"<Template {self.name}>"
