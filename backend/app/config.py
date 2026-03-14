from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/dgl.db"
    SECRET_KEY: str = "change-me-to-a-real-secret-key"

    PHOTOS_PASSWORD: str = "change-me"

    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    SES_SENDER_EMAIL: str = ""

    LETTER_SEND_HOUR: int = 8
    LETTER_SEND_TIMEZONE: str = "America/New_York"

    UPLOAD_DIR: str = "./uploads"

    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
