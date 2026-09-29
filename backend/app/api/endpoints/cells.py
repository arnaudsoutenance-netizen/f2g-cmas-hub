"""
F2G CMAS Hub - Cell Site Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models import User, CellSite
from app.schemas import (
    CellSiteCreate,
    CellSiteUpdate,
    CellSiteResponse,
    CellStatusResponse,
)
from app.services.enb_controller import ENBController


router = APIRouter(prefix="/cells", tags=["Cell Sites"])


@router.get("", response_model=List[CellSiteResponse])
async def list_cells(
    status: Optional[str] = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all cell sites."""
    query = select(CellSite)
    
    if status:
        query = query.where(CellSite.status == status)
    
    query = query.order_by(CellSite.name)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=CellSiteResponse, status_code=status.HTTP_201_CREATED)
async def create_cell(
    cell_data: CellSiteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),  # Admin only
):
    """Create a new cell site (Admin only)."""
    # Check if cell_id already exists
    result = await db.execute(
        select(CellSite).where(CellSite.cell_id == cell_data.cell_id)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cell ID {cell_data.cell_id} already exists"
        )
    
    cell = CellSite(**cell_data.model_dump())
    db.add(cell)
    await db.commit()
    await db.refresh(cell)
    return cell


@router.get("/{cell_id}", response_model=CellSiteResponse)
async def get_cell(
    cell_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get cell site by ID."""
    result = await db.execute(select(CellSite).where(CellSite.id == cell_id))
    cell = result.scalar_one_or_none()
    
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cell site not found"
        )
    
    return cell


@router.patch("/{cell_id}", response_model=CellSiteResponse)
async def update_cell(
    cell_id: str,
    cell_data: CellSiteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),  # Admin only
):
    """Update a cell site (Admin only)."""
    result = await db.execute(select(CellSite).where(CellSite.id == cell_id))
    cell = result.scalar_one_or_none()
    
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cell site not found"
        )
    
    update_data = cell_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cell, key, value)
    
    await db.commit()
    await db.refresh(cell)
    return cell


@router.delete("/{cell_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cell(
    cell_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),  # Admin only
):
    """Delete a cell site (Admin only)."""
    result = await db.execute(select(CellSite).where(CellSite.id == cell_id))
    cell = result.scalar_one_or_none()
    
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cell site not found"
        )
    
    await db.delete(cell)
    await db.commit()


@router.get("/{cell_id}/status", response_model=CellStatusResponse)
async def get_cell_status(
    cell_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get real-time status of a cell site (queries eNB via SSH)."""
    result = await db.execute(select(CellSite).where(CellSite.id == cell_id))
    cell = result.scalar_one_or_none()
    
    if not cell:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cell site not found"
        )
    
    # Query eNB status
    controller = ENBController(cell)
    enb_status = await controller.get_status()
    await controller.disconnect()
    
    # Update last_health_check
    cell.last_health_check = datetime.now(timezone.utc)
    if enb_status.get("running"):
        cell.last_seen = datetime.now(timezone.utc)
        cell.status = "active"
    else:
        cell.status = "offline"
    
    await db.commit()
    
    return CellStatusResponse(
        id=cell.id,
        name=cell.name,
        status=cell.status,
        enb_status=enb_status,
        last_health_check=cell.last_health_check
    )


@router.post("/health-check", response_model=List[CellStatusResponse])
async def health_check_all(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run health check on all active cell sites."""
    result = await db.execute(
        select(CellSite).where(CellSite.status != "maintenance")
    )
    cells = result.scalars().all()
    
    statuses = []
    for cell in cells:
        controller = ENBController(cell)
        enb_status = await controller.get_status()
        await controller.disconnect()
        
        cell.last_health_check = datetime.now(timezone.utc)
        if enb_status.get("running"):
            cell.last_seen = datetime.now(timezone.utc)
            cell.status = "active"
        else:
            cell.status = "offline"
        
        statuses.append(CellStatusResponse(
            id=cell.id,
            name=cell.name,
            status=cell.status,
            enb_status=enb_status,
            last_health_check=cell.last_health_check
        ))
    
    await db.commit()
    return statuses
