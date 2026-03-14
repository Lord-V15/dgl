import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import auth, letters, photos, quotes, timeline
from app.services.scheduler import start_scheduler, stop_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    Path("data").mkdir(parents=True, exist_ok=True)
    await init_db()
    logger.info("Database initialised.")

    start_scheduler()
    logger.info("Application started.")

    yield

    # Shutdown
    stop_scheduler()
    logger.info("Application shut down.")


app = FastAPI(
    title="Dearest Gentle Reader",
    description="Letters to your future self, photo memories, and curated quotes.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(letters.router)
app.include_router(photos.router)
app.include_router(quotes.router)
app.include_router(timeline.router)


@app.get("/")
async def root():
    return {"message": "Dearest Gentle Reader API"}
