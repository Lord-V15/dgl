from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Milestone
from app.routers.auth import get_current_user
from app.schemas import MilestoneCreate, MilestoneResponse

router = APIRouter(
    prefix="/api/timeline",
    tags=["timeline"],
)


@router.post(
    "",
    response_model=MilestoneResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)],
)
async def create_milestone(
    body: MilestoneCreate, db: AsyncSession = Depends(get_db)
) -> Milestone:
    milestone = Milestone(
        title=body.title,
        description=body.description,
        milestone_date=body.milestone_date,
        photo_id=body.photo_id,
    )
    db.add(milestone)
    await db.flush()
    await db.refresh(milestone)
    return milestone


@router.get("", response_model=list[MilestoneResponse])
async def list_milestones(db: AsyncSession = Depends(get_db)) -> list[Milestone]:
    stmt = select(Milestone).order_by(Milestone.milestone_date.asc())
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.delete(
    "/{milestone_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_user)],
)
async def delete_milestone(
    milestone_id: str, db: AsyncSession = Depends(get_db)
) -> None:
    result = await db.execute(select(Milestone).where(Milestone.id == milestone_id))
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Milestone not found"
        )
    await db.delete(milestone)
