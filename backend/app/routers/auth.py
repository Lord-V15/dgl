from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.config import settings
from app.schemas import PasswordVerify, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()


def _create_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + expires_delta
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") != "authenticated":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )


@router.post("/verify", response_model=TokenResponse)
async def verify_password(body: PasswordVerify) -> TokenResponse:
    if body.password != settings.SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password"
        )
    token = _create_token(
        {"sub": "authenticated"}, timedelta(hours=TOKEN_EXPIRE_HOURS)
    )
    return TokenResponse(access_token=token)


@router.post("/verify-memories", response_model=TokenResponse)
async def verify_memories_password(body: PasswordVerify) -> TokenResponse:
    if body.password != settings.PHOTOS_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password"
        )
    token = _create_token(
        {"sub": "authenticated"}, timedelta(hours=TOKEN_EXPIRE_HOURS)
    )
    return TokenResponse(access_token=token)
