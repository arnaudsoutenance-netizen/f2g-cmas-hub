"""
F2G CMAS Hub - Pydantic Schemas
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# =====================
# ENUMS
# =====================

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    OPERATOR = "OPERATOR"
    VIEWER = "VIEWER"


class AlertType(str, Enum):
    CMAS = "CMAS"
    ETWS = "ETWS"


class AlertStatus(str, Enum):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    SENDING = "SENDING"
    SENT = "SENT"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


# =====================
# USER SCHEMAS
# =====================

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.OPERATOR


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: str
    email: str
    role: UserRole


# =====================
# ALERT SCHEMAS
# =====================

class AlertCellBase(BaseModel):
    cell_id: str
    status: str = "pending"
    sent_at: Optional[datetime] = None


class AlertCellResponse(AlertCellBase):
    id: str
    cell_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class AlertLogResponse(BaseModel):
    id: str
    action: str
    status: str
    message: Optional[str]
    metadata: Optional[dict]
    timestamp: datetime
    
    class Config:
        from_attributes = True


class AlertBase(BaseModel):
    alert_type: AlertType
    message_id: int = Field(..., ge=4352, le=4399)
    content: str = Field(..., min_length=1, max_length=1395)
    duration: int = Field(default=3600, ge=60, le=86400)
    
    @field_validator("message_id")
    @classmethod
    def validate_message_id(cls, v, info):
        alert_type = info.data.get("alert_type")
        if alert_type == AlertType.CMAS:
            if not (4370 <= v <= 4399):
                raise ValueError("CMAS message_id must be between 4370 and 4399")
        elif alert_type == AlertType.ETWS:
            if not (4352 <= v <= 4359):
                raise ValueError("ETWS message_id must be between 4352 and 4359")
        return v


class AlertCreate(AlertBase):
    cell_ids: List[str] = Field(..., min_length=1)
    scheduled_at: Optional[datetime] = None
    template_id: Optional[str] = None


class AlertUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=1395)
    scheduled_at: Optional[datetime] = None
    duration: Optional[int] = Field(None, ge=60, le=86400)
    cell_ids: Optional[List[str]] = None


class AlertResponse(AlertBase):
    id: str
    status: AlertStatus
    scheduled_at: Optional[datetime]
    sent_at: Optional[datetime]
    expires_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    created_by: str
    template_id: Optional[str]
    cells: List[AlertCellResponse] = []
    
    class Config:
        from_attributes = True


class AlertDetailResponse(AlertResponse):
    logs: List[AlertLogResponse] = []
    created_by_user: Optional[UserResponse] = None


class AlertSendRequest(BaseModel):
    immediate: bool = True


class AlertSendResponse(BaseModel):
    id: str
    status: AlertStatus
    message: str
    job_id: Optional[str] = None


# =====================
# TEMPLATE SCHEMAS
# =====================

class TemplateBase(BaseModel):
    name: str
    category: str
    alert_type: AlertType
    message_id: int = Field(..., ge=4352, le=4399)
    content: str = Field(..., min_length=1, max_length=1395)
    default_duration: int = Field(default=3600, ge=60, le=86400)


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = Field(None, min_length=1, max_length=1395)
    default_duration: Optional[int] = Field(None, ge=60, le=86400)
    is_active: Optional[bool] = None


class TemplateResponse(TemplateBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# =====================
# CELL SITE SCHEMAS
# =====================

class CellSiteBase(BaseModel):
    name: str
    cell_id: str
    tac: int = Field(default=1, ge=1, le=65535)  # TAC for CMAS zone targeting
    enb_ip: str
    enb_port: int = 22
    enb_username: str = "root"
    enb_config_path: str = "/etc/srsenb/sib.conf"
    earfcn: Optional[int] = None
    pci: Optional[int] = None
    location: Optional[str] = None
    zone_name: Optional[str] = None


class CellSiteCreate(CellSiteBase):
    pass


class CellSiteUpdate(BaseModel):
    name: Optional[str] = None
    tac: Optional[int] = Field(None, ge=1, le=65535)
    enb_ip: Optional[str] = None
    enb_port: Optional[int] = None
    enb_username: Optional[str] = None
    enb_config_path: Optional[str] = None
    earfcn: Optional[int] = None
    pci: Optional[int] = None
    location: Optional[str] = None
    zone_name: Optional[str] = None
    status: Optional[str] = None


class CellSiteResponse(CellSiteBase):
    id: str
    status: str
    last_seen: Optional[datetime]
    last_health_check: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class CellStatusResponse(BaseModel):
    id: str
    name: str
    status: str
    enb_status: Optional[dict] = None
    last_health_check: Optional[datetime]


# =====================
# STATS SCHEMAS
# =====================

class AlertStats(BaseModel):
    total: int
    sent: int
    scheduled: int
    failed: int
    draft: int


class TodayStats(BaseModel):
    sent: int
    scheduled: int


class CellStats(BaseModel):
    total: int
    active: int
    offline: int


class DashboardStats(BaseModel):
    alerts: AlertStats
    today: TodayStats
    cells: CellStats
    success_rate: float


# =====================
# PAGINATION
# =====================

class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int


class PaginatedResponse(BaseModel):
    data: List
    pagination: PaginationMeta
