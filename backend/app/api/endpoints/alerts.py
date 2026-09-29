"""
F2G CMAS Hub - Alert Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime, timezone, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import User, Alert, AlertCell, AlertLog, CellSite, AlertStatus
from app.schemas import (
    AlertCreate,
    AlertUpdate,
    AlertResponse,
    AlertDetailResponse,
    AlertSendRequest,
    AlertSendResponse,
    PaginatedResponse,
    PaginationMeta,
)
from app.services.enb_controller import AlertDispatcher


router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=PaginatedResponse)
async def list_alerts(
    status: Optional[str] = Query(None, description="Filter by status"),
    alert_type: Optional[str] = Query(None, description="Filter by type (CMAS/ETWS)"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all alerts with filtering and pagination."""
    query = select(Alert).options(selectinload(Alert.cells))
    
    # Apply filters
    if status:
        query = query.where(Alert.status == status)
    if alert_type:
        query = query.where(Alert.alert_type == alert_type)
    
    # Count total
    count_query = select(func.count(Alert.id))
    if status:
        count_query = count_query.where(Alert.status == status)
    if alert_type:
        count_query = count_query.where(Alert.alert_type == alert_type)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Apply sorting
    sort_column = getattr(Alert, sort_by, Alert.created_at)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    
    result = await db.execute(query)
    alerts = result.scalars().all()
    
    return PaginatedResponse(
        data=[AlertResponse.model_validate(a) for a in alerts],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=(total + limit - 1) // limit
        )
    )


@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert_data: AlertCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new alert."""
    # Verify all cells exist
    result = await db.execute(
        select(CellSite).where(CellSite.id.in_(alert_data.cell_ids))
    )
    cells = result.scalars().all()
    
    if len(cells) != len(alert_data.cell_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more cell IDs are invalid"
        )
    
    # Check for offline cells
    offline_cells = [c for c in cells if c.status == "offline"]
    if offline_cells:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot target offline cells: {[c.name for c in offline_cells]}"
        )
    
    # Determine status
    status_value = AlertStatus.SCHEDULED if alert_data.scheduled_at else AlertStatus.DRAFT
    
    # Create alert
    alert = Alert(
        alert_type=alert_data.alert_type,
        message_id=alert_data.message_id,
        content=alert_data.content,
        duration=alert_data.duration,
        scheduled_at=alert_data.scheduled_at,
        status=status_value,
        created_by=current_user.id,
        template_id=alert_data.template_id,
    )
    
    db.add(alert)
    await db.flush()  # Get alert.id
    
    # Create alert-cell associations
    for cell_id in alert_data.cell_ids:
        alert_cell = AlertCell(alert_id=alert.id, cell_id=cell_id)
        db.add(alert_cell)
    
    # Create log entry
    log = AlertLog(
        alert_id=alert.id,
        action="CREATED",
        status="success",
        message=f"Alert created by {current_user.name}",
        metadata={"user_id": current_user.id}
    )
    db.add(log)
    
    await db.commit()
    
    # Reload with relationships
    result = await db.execute(
        select(Alert)
        .options(selectinload(Alert.cells))
        .where(Alert.id == alert.id)
    )
    alert = result.scalar_one()
    
    return alert


@router.get("/{alert_id}", response_model=AlertDetailResponse)
async def get_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get alert details."""
    result = await db.execute(
        select(Alert)
        .options(
            selectinload(Alert.cells).selectinload(AlertCell.cell),
            selectinload(Alert.logs),
            selectinload(Alert.created_by_user)
        )
        .where(Alert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    return alert


@router.patch("/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_id: str,
    alert_data: AlertUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an alert. Only DRAFT or SCHEDULED alerts can be updated."""
    result = await db.execute(
        select(Alert)
        .options(selectinload(Alert.cells))
        .where(Alert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    if alert.status not in [AlertStatus.DRAFT, AlertStatus.SCHEDULED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot update alert with status {alert.status.value}"
        )
    
    # Update fields
    update_data = alert_data.model_dump(exclude_unset=True)
    
    if "cell_ids" in update_data:
        cell_ids = update_data.pop("cell_ids")
        # Verify cells exist
        result = await db.execute(
            select(CellSite).where(CellSite.id.in_(cell_ids))
        )
        cells = result.scalars().all()
        
        if len(cells) != len(cell_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more cell IDs are invalid"
            )
        
        # Remove old associations
        await db.execute(
            AlertCell.__table__.delete().where(AlertCell.alert_id == alert_id)
        )
        
        # Add new associations
        for cell_id in cell_ids:
            db.add(AlertCell(alert_id=alert_id, cell_id=cell_id))
    
    for key, value in update_data.items():
        setattr(alert, key, value)
    
    # Update status if scheduling changed
    if alert_data.scheduled_at and alert.status == AlertStatus.DRAFT:
        alert.status = AlertStatus.SCHEDULED
    
    # Log update
    log = AlertLog(
        alert_id=alert.id,
        action="UPDATED",
        status="success",
        message=f"Alert updated by {current_user.name}",
        metadata={"updated_fields": list(update_data.keys())}
    )
    db.add(log)
    
    await db.commit()
    await db.refresh(alert)
    
    return alert


@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an alert. Only DRAFT alerts can be deleted."""
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    if alert.status != AlertStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only DRAFT alerts can be deleted. Cancel scheduled alerts first."
        )
    
    await db.delete(alert)
    await db.commit()


@router.post("/{alert_id}/send", response_model=AlertSendResponse)
async def send_alert(
    alert_id: str,
    send_request: AlertSendRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Send an alert immediately or schedule it."""
    result = await db.execute(
        select(Alert)
        .options(selectinload(Alert.cells).selectinload(AlertCell.cell))
        .where(Alert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    if alert.status not in [AlertStatus.DRAFT, AlertStatus.SCHEDULED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot send alert with status {alert.status.value}"
        )
    
    if not alert.cells:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Alert has no target cells"
        )
    
    # Update status
    alert.status = AlertStatus.SENDING
    
    # Log send attempt
    log = AlertLog(
        alert_id=alert.id,
        action="SENDING",
        status="info",
        message=f"Alert dispatch initiated by {current_user.name}",
    )
    db.add(log)
    await db.commit()
    
    # Dispatch to all cells
    cells_data = [(ac.cell, ac) for ac in alert.cells]
    dispatch_result = await AlertDispatcher.dispatch_alert(alert, cells_data)
    
    # Update alert status based on results
    if dispatch_result["failed"] == 0:
        alert.status = AlertStatus.SENT
        alert.sent_at = datetime.now(timezone.utc)
        alert.expires_at = alert.sent_at + timedelta(seconds=alert.duration)
        message = f"Alert sent successfully to {dispatch_result['success']} cell(s)"
    elif dispatch_result["success"] == 0:
        alert.status = AlertStatus.FAILED
        message = f"Alert failed to send to all {dispatch_result['failed']} cell(s)"
    else:
        alert.status = AlertStatus.SENT  # Partial success
        alert.sent_at = datetime.now(timezone.utc)
        alert.expires_at = alert.sent_at + timedelta(seconds=alert.duration)
        message = f"Alert sent to {dispatch_result['success']} cell(s), failed on {dispatch_result['failed']} cell(s)"
    
    # Log result
    log = AlertLog(
        alert_id=alert.id,
        action="SENT" if alert.status == AlertStatus.SENT else "FAILED",
        status="success" if dispatch_result["failed"] == 0 else "error",
        message=message,
        metadata=dispatch_result
    )
    db.add(log)
    await db.commit()
    
    return AlertSendResponse(
        id=alert.id,
        status=alert.status,
        message=message
    )


@router.post("/{alert_id}/cancel", response_model=AlertResponse)
async def cancel_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancel a scheduled alert."""
    result = await db.execute(
        select(Alert)
        .options(selectinload(Alert.cells))
        .where(Alert.id == alert_id)
    )
    alert = result.scalar_one_or_none()
    
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    if alert.status != AlertStatus.SCHEDULED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only SCHEDULED alerts can be cancelled"
        )
    
    alert.status = AlertStatus.CANCELLED
    
    # Log cancellation
    log = AlertLog(
        alert_id=alert.id,
        action="CANCELLED",
        status="success",
        message=f"Alert cancelled by {current_user.name}",
    )
    db.add(log)
    
    await db.commit()
    await db.refresh(alert)
    
    return alert
