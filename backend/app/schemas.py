from datetime import date, datetime

from pydantic import BaseModel


# --- Auth ---


class PasswordVerify(BaseModel):
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- Letters ---


class LetterCreate(BaseModel):
    recipient_email: str
    sender_name: str
    subject: str
    body: str
    delivery_date: date


class LetterSendNow(BaseModel):
    recipient_email: str
    sender_name: str
    subject: str
    body: str


class LetterResponse(BaseModel):
    id: str
    recipient_email: str
    sender_name: str
    subject: str
    body: str
    delivery_date: date
    status: str
    created_at: datetime
    sent_at: datetime | None = None
    opened_at: datetime | None = None

    model_config = {"from_attributes": True}


# --- Photos ---


class PhotoResponse(BaseModel):
    id: str
    filename: str
    original_name: str
    caption: str | None = None
    taken_date: date | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Quotes ---


class QuoteResponse(BaseModel):
    text: str
    source: str
    character: str | None = None


# --- Timeline / Milestones ---


class MilestoneCreate(BaseModel):
    title: str
    description: str | None = None
    milestone_date: date
    photo_id: str | None = None


class MilestoneResponse(BaseModel):
    id: str
    title: str
    description: str | None = None
    milestone_date: date
    photo_id: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
