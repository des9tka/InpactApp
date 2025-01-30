import os
import aiosmtplib
from email.message import EmailMessage
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from dotenv import load_dotenv
from pathlib import Path

from core.tokens import create_activate_token

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.example.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "your_email@example.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your_password")


async def send_email_html_file(recipient: str, subject: str, html_file_path: str, activate_link: str):
    html_path = Path(html_file_path)

    if not html_path.is_file():
        raise HTTPException(status_code=404, detail="HTML template not found")

    with open(html_path, "r", encoding="utf-8") as file:
        html_body = file.read()

    html_body = html_body.replace("{{activate_link}}", activate_link)

    msg = EmailMessage()
    msg["From"] = SMTP_USER
    msg["To"] = recipient
    msg["Subject"] = subject

    msg.set_content(f"Activate your account: {activate_link}. If you didn't register, ignore this email.")

    msg.add_alternative(html_body, subtype="html")

    await aiosmtplib.send(
        msg,
        hostname=SMTP_SERVER,
        port=SMTP_PORT,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
        start_tls=True
    )

async def send_email_endpoint(
    recipient: str, 
    subject: str, 
    html_file_path: str, 
    activate_link: str, 
    background_tasks: BackgroundTasks
):
	background_tasks.add_task(send_email_html_file, recipient, subject, html_file_path, activate_link)
	return {"Email was sended by aio."}

async def send_activate_email(user_email: str, user_id: int, background_tasks: BackgroundTasks):
	activate_token = await create_activate_token(user_id=user_id)
	activate_link = os.getenv("WEB_HOST") + "/activate/" + activate_token

	html_file_path = Path.cwd() / "templates" / "activate_email.html"

	await send_email_endpoint(recipient=user_email, subject="Activate account", html_file_path=html_file_path, activate_link=activate_link, background_tasks=background_tasks)
