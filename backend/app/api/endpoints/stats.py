"""
F2G CMAS Hub - Stats Endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timezone, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import User, Alert, CellSite, AlertStatus
from app.schemas import (
    DashboardStats,
    AlertStats,
    TodayStats,
    CellStats,
    NetworkStats,
)


router = APIRouter(prefix="/stats", tags=["Statistics"])


@router.get("", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get dashboard statistics."""
    
    # Alert counts by status
    total_result = await db.execute(select(func.count(Alert.id)))
    total = total_result.scalar() or 0
    
    sent_result = await db.execute(
        select(func.count(Alert.id)).where(Alert.status == AlertStatus.SENT)
    )
    sent = sent_result.scalar() or 0
    
    scheduled_result = await db.execute(
        select(func.count(Alert.id)).where(Alert.status == AlertStatus.SCHEDULED)
    )
    scheduled = scheduled_result.scalar() or 0
    
    failed_result = await db.execute(
        select(func.count(Alert.id)).where(Alert.status == AlertStatus.FAILED)
    )
    failed = failed_result.scalar() or 0
    
    draft_result = await db.execute(
        select(func.count(Alert.id)).where(Alert.status == AlertStatus.DRAFT)
    )
    draft = draft_result.scalar() or 0
    
    # Today's stats
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    today_sent_result = await db.execute(
        select(func.count(Alert.id)).where(
            and_(
                Alert.status == AlertStatus.SENT,
                Alert.sent_at >= today_start
            )
        )
    )
    today_sent = today_sent_result.scalar() or 0
    
    today_scheduled_result = await db.execute(
        select(func.count(Alert.id)).where(
            and_(
                Alert.status == AlertStatus.SCHEDULED,
                Alert.scheduled_at >= today_start,
                Alert.scheduled_at < today_start + timedelta(days=1)
            )
        )
    )
    today_scheduled = today_scheduled_result.scalar() or 0
    
    # Cell stats
    cell_total_result = await db.execute(select(func.count(CellSite.id)))
    cell_total = cell_total_result.scalar() or 0
    
    cell_active_result = await db.execute(
        select(func.count(CellSite.id)).where(CellSite.status == "active")
    )
    cell_active = cell_active_result.scalar() or 0
    
    cell_offline_result = await db.execute(
        select(func.count(CellSite.id)).where(CellSite.status == "offline")
    )
    cell_offline = cell_offline_result.scalar() or 0
    
    # Network stats (eNBs and MMEs)
    # Count unique eNBs by IP (each cell has an eNB IP)
    enb_result = await db.execute(
        select(func.count(func.distinct(CellSite.enb_ip))).where(CellSite.status == "active")
    )
    enbs_connected = enb_result.scalar() or 0
    
    # MME count: For now, we assume 1 MME (Open5GS) per deployment
    # In production, this could be fetched from a network_elements table
    mmes_connected = 1 if cell_active > 0 else 0
    
    # Success rate
    total_sent_or_failed = sent + failed
    success_rate = (sent / total_sent_or_failed * 100) if total_sent_or_failed > 0 else 100.0
    
    return DashboardStats(
        alerts=AlertStats(
            total=total,
            sent=sent,
            scheduled=scheduled,
            failed=failed,
            draft=draft
        ),
        today=TodayStats(
            sent=today_sent,
            scheduled=today_scheduled
        ),
        cells=CellStats(
            total=cell_total,
            active=cell_active,
            offline=cell_offline
        ),
        network=NetworkStats(
            enbs_connected=enbs_connected,
            mmes_connected=mmes_connected,
            cells_online=cell_active
        ),
        success_rate=round(success_rate, 1)
    )
