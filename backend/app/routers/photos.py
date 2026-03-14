import os
import uuid
from datetime import date
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import Photo
from app.routers.auth import get_current_user
from app.schemas import PhotoResponse

router = APIRouter(prefix="/api/photos", tags=["photos"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic"}


def _get_upload_dir() -> Path:
    path = Path(settings.UPLOAD_DIR)
    path.mkdir(parents=True, exist_ok=True)
    return path


@router.post(
    "",
    response_model=PhotoResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)],
)
async def upload_photo(
    file: UploadFile = File(...),
    caption: str | None = Form(None),
    taken_date: date | None = Form(None),
    db: AsyncSession = Depends(get_db),
) -> Photo:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No file provided"
        )

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{ext}' not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    unique_filename = f"{uuid.uuid4()}{ext}"
    upload_dir = _get_upload_dir()
    file_path = upload_dir / unique_filename

    content = await file.read()
    file_path.write_bytes(content)

    photo = Photo(
        filename=unique_filename,
        original_name=file.filename,
        caption=caption,
        taken_date=taken_date,
        storage_path=str(file_path),
    )
    db.add(photo)
    await db.flush()
    await db.refresh(photo)
    return photo


@router.get(
    "",
    response_model=list[PhotoResponse],
    dependencies=[Depends(get_current_user)],
)
async def list_photos(db: AsyncSession = Depends(get_db)) -> list[Photo]:
    stmt = select(Photo).order_by(Photo.taken_date.desc().nulls_last())
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.delete(
    "/{photo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_user)],
)
async def delete_photo(photo_id: str, db: AsyncSession = Depends(get_db)) -> None:
    result = await db.execute(select(Photo).where(Photo.id == photo_id))
    photo = result.scalar_one_or_none()
    if not photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found"
        )

    file_path = Path(photo.storage_path)
    if file_path.exists():
        file_path.unlink()

    await db.delete(photo)


@router.get("/file/{filename}")
async def serve_photo(filename: str) -> FileResponse:
    file_path = _get_upload_dir() / filename
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )
    return FileResponse(file_path)
