import logging
from pathlib import Path

import boto3
from botocore.exceptions import ClientError
from jinja2 import Environment, FileSystemLoader

from app.config import settings
from app.models import Letter

logger = logging.getLogger(__name__)

_template_dir = Path(__file__).resolve().parent.parent / "templates"
_jinja_env = Environment(loader=FileSystemLoader(str(_template_dir)), autoescape=True)


class EmailService:
    def __init__(self) -> None:
        self._client = boto3.client(
            "ses",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
        )

    def send_letter(self, letter: Letter) -> bool:
        try:
            template = _jinja_env.get_template("letter_email.html")
            html_body = template.render(
                subject=letter.subject,
                body=letter.body,
                sender_name=letter.sender_name,
            )

            self._client.send_email(
                Source=settings.SES_SENDER_EMAIL,
                Destination={"ToAddresses": [letter.recipient_email]},
                ReplyToAddresses=["vibhansh@novyte.in"],
                Message={
                    "Subject": {
                        "Data": letter.subject,
                        "Charset": "UTF-8",
                    },
                    "Body": {
                        "Html": {
                            "Data": html_body,
                            "Charset": "UTF-8",
                        },
                    },
                },
            )
            logger.info("Email sent successfully to %s", letter.recipient_email)
            return True

        except ClientError as exc:
            logger.error(
                "Failed to send email to %s: %s",
                letter.recipient_email,
                exc.response["Error"]["Message"],
            )
            return False
        except Exception:
            logger.exception("Unexpected error sending email to %s", letter.recipient_email)
            return False
