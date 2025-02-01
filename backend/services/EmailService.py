import os
import aiosmtplib
from email.message import EmailMessage
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from dotenv import load_dotenv
from pathlib import Path

from core.tokens import create_activate_token, create_recovery_token

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

async def send_email_html_file(
        recipient: str, 
        subject: str, 
        html_file_path: str, 
        activate_link: str | None = None, 
        recovery_token: str | None = None,
        invite_link: str | None = None,
        inviter_project: str | None = None
    ):
    try:

        html_path = Path(html_file_path)

        if not html_path.is_file():
            raise HTTPException(status_code=404, detail="HTML template not found")

        with open(html_path, "r", encoding="utf-8") as file:
            html_body = file.read()

        if activate_link:
            html_body = html_body.replace("{{activate_link}}", activate_link)

        elif recovery_token:
            html_body = html_body.replace("{{recovery_token}}", recovery_token)

        elif invite_link and inviter_project:
            html_body = html_body.replace("{{inviter_project}}", inviter_project)
            html_body = html_body.replace("{{invite_link}}", invite_link)

        else:
            raise HTTPException(status_code=404, detail="HTML Attribute not found")

        msg = EmailMessage()
        msg["From"] = SMTP_USER
        msg["To"] = recipient
        msg["Subject"] = subject

        if activate_link:
            msg.set_content(f"Activate your account: {activate_link}. If you didn't register, ignore this email.")

        elif recovery_token:
            msg.set_content(f"Recovery your password: {recovery_token}. If you didn't register, ignore this email.")

        elif invite_project_link:
            msg.set_content(f"You have been invited to to project <{inviter_project}>, link: {invite_project_link}. If you suggested to receive invite link, ignore this email.")

        msg.add_alternative(html_body, subtype="html")

        await aiosmtplib.send(
            msg,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASSWORD,
            start_tls=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

async def send_email_endpoint(
    recipient: str, 
    subject: str, 
    html_file_path: str, 
    background_tasks: BackgroundTasks,
    activate_link: str | None = None, 
    recovery_token: str | None = None,
    invite_link: str | None = None,
    inviter_project: str | None = None
):
	background_tasks.add_task(send_email_html_file, recipient, subject, html_file_path, activate_link, recovery_token, invite_link, inviter_project)
	return {"Email was sended by aio."}

async def send_activate_email(user_email: str, activate_token: str, background_tasks: BackgroundTasks):
	activate_link = os.getenv("WEB_HOST") + "/activate/" + activate_token

	html_file_path = Path.cwd() / "templates" / "activate_email.html"

	await send_email_endpoint(recipient=user_email, subject="Activate account", html_file_path=html_file_path, activate_link=activate_link, background_tasks=background_tasks)

async def send_recovery_email(user_email: str, background_tasks: BackgroundTasks, recovery_token: str):
       
    html_file_path = Path.cwd() / "templates" / "recovery_email.html"
    await send_email_endpoint(
        recipient=user_email, 
        subject="Recovery password code", 
        html_file_path=html_file_path,  
        recovery_token=recovery_token, 
        background_tasks=background_tasks
    )

async def send_invite_project_link(user_email: str, inviter_project: str, invite_project_token: str, background_tasks: BackgroundTasks):

       
    html_file_path = Path.cwd() / "templates" / "invite_project_email.html"
    invite_link = os.getenv("WEB_HOST") + "/invite/" + invite_project_token

    await send_email_endpoint(
        recipient=user_email, 
        subject="Invite to project", 
        html_file_path=html_file_path,  
        invite_link=invite_link, 
        inviter_project=inviter_project,
        background_tasks=background_tasks
    )