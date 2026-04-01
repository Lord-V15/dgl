from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Letter
from app.routers.auth import get_current_user
from app.schemas import LetterCreate, LetterResponse, LetterSendNow
from app.services.email_service import EmailService

router = APIRouter(prefix="/api/letters", tags=["letters"])


@router.post("", response_model=LetterResponse, status_code=status.HTTP_201_CREATED)
async def create_letter(
    body: LetterCreate, db: AsyncSession = Depends(get_db)
) -> Letter:
    if body.delivery_date <= date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delivery date must be in the future",
        )
    letter = Letter(
        recipient_email=body.recipient_email,
        sender_name=body.sender_name,
        subject=body.subject,
        body=body.body,
        delivery_date=body.delivery_date,
    )
    db.add(letter)
    await db.flush()
    await db.refresh(letter)
    return letter


@router.post("/send-now", response_model=LetterResponse, status_code=status.HTTP_201_CREATED)
async def send_letter_now(
    body: LetterSendNow,
    db: AsyncSession = Depends(get_db),
    _user: dict = Depends(get_current_user),
) -> Letter:
    letter = Letter(
        recipient_email=body.recipient_email,
        sender_name=body.sender_name,
        subject=body.subject,
        body=body.body,
        delivery_date=date.today(),
    )
    db.add(letter)
    await db.flush()
    await db.refresh(letter)

    email_service = EmailService()
    success = email_service.send_letter(letter)
    if not success:
        letter.status = "failed"
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to send email. Letter saved as failed.",
        )
    letter.status = "sent"
    letter.sent_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(letter)
    return letter


@router.get("", response_model=list[LetterResponse])
async def list_letters(
    status_filter: str | None = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
) -> list[Letter]:
    stmt = select(Letter).order_by(Letter.created_at.desc())
    if status_filter:
        stmt = stmt.where(Letter.status == status_filter)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/upcoming", response_model=list[LetterResponse])
async def upcoming_letters(db: AsyncSession = Depends(get_db)) -> list[Letter]:
    stmt = (
        select(Letter)
        .where(Letter.status == "pending")
        .order_by(Letter.delivery_date.asc())
        .limit(5)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/{letter_id}", response_model=LetterResponse)
async def get_letter(letter_id: str, db: AsyncSession = Depends(get_db)) -> Letter:
    result = await db.execute(select(Letter).where(Letter.id == letter_id))
    letter = result.scalar_one_or_none()
    if not letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Letter not found"
        )
    return letter


@router.delete("/{letter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_letter(letter_id: str, db: AsyncSession = Depends(get_db)) -> None:
    result = await db.execute(select(Letter).where(Letter.id == letter_id))
    letter = result.scalar_one_or_none()
    if not letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Letter not found"
        )
    if letter.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending letters can be deleted",
        )
    await db.delete(letter)
