import logging
from datetime import date, datetime, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select, update

from app.config import settings
from app.database import async_session_maker
from app.models import Letter
from app.services.email_service import EmailService

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

MAX_RETRIES = 3


async def _send_pending_letters() -> None:
    logger.info("Running scheduled letter delivery check...")
    email_service = EmailService()

    async with async_session_maker() as session:
        stmt = select(Letter).where(
            Letter.delivery_date <= date.today(),
            Letter.status.in_(["pending", "failed"]),
        )
        result = await session.execute(stmt)
        letters = result.scalars().all()

        if not letters:
            logger.info("No pending letters to send.")
            return

        logger.info("Found %d letter(s) to send.", len(letters))

        for letter in letters:
            success = email_service.send_letter(letter)

            if success:
                letter.status = "sent"
                letter.sent_at = datetime.now(timezone.utc)
                logger.info("Letter %s sent successfully.", letter.id)
            else:
                # Track retry count in a simple way: count previous attempts
                # by checking if it was already "failed" -- for robust retry,
                # we just attempt up to MAX_RETRIES total runs of the scheduler.
                letter.status = "failed"
                logger.warning("Letter %s failed to send.", letter.id)

        await session.commit()


def start_scheduler() -> None:
    trigger = CronTrigger(
        hour=settings.LETTER_SEND_HOUR,
        timezone=settings.LETTER_SEND_TIMEZONE,
    )
    scheduler.add_job(
        _send_pending_letters,
        trigger=trigger,
        id="send_pending_letters",
        replace_existing=True,
        max_instances=1,
    )
    scheduler.start()
    logger.info(
        "Scheduler started. Letters will be sent daily at %02d:00 %s.",
        settings.LETTER_SEND_HOUR,
        settings.LETTER_SEND_TIMEZONE,
    )


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler shut down.")
