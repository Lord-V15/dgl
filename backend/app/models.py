import uuid
from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _new_uuid() -> str:
    return str(uuid.uuid4())


class Base(DeclarativeBase):
    pass


class Letter(Base):
    __tablename__ = "letters"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    recipient_email: Mapped[str] = mapped_column(String, nullable=False)
    sender_name: Mapped[str] = mapped_column(String, nullable=False)
    subject: Mapped[str] = mapped_column(String, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    delivery_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String, default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    opened_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class Photo(Base):
    __tablename__ = "photos"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    filename: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    original_name: Mapped[str] = mapped_column(String, nullable=False)
    caption: Mapped[str | None] = mapped_column(String, nullable=True)
    taken_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    storage_path: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)

    milestones: Mapped[list["Milestone"]] = relationship(
        "Milestone", back_populates="photo"
    )


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_new_uuid)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    milestone_date: Mapped[date] = mapped_column(Date, nullable=False)
    photo_id: Mapped[str | None] = mapped_column(
        String, ForeignKey("photos.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)

    photo: Mapped[Photo | None] = relationship("Photo", back_populates="milestones")
