from fastapi import HTTPException
import re

def validate_password(password: str) -> str:
    if not re.search(r"\d", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one digit.")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter.")
    if len(password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters long.")
    if len(password) > 20:
        raise HTTPException(status_code=400, detail="Password must be at most 20 characters long.")	
    return password

def validate_name(value: str) -> str:
    if value and not re.match(r"^[A-Za-z]+$", value):
        raise HTTPException(status_code=400, detail="Name and surname must contain only letters.")
    if len(value) < 2:
        raise HTTPException(status_code=400, detail="Name must be at least 2 characters long.")
    if len(value) > 50:
        raise HTTPException(status_code=400, detail="Name/surname must be at most 50 characters long.")
    return value

def validate_username(value: str) -> str:
    if not re.match(r"^[a-zA-Z0-9_]+$", value):
        raise HTTPException(status_code=400, detail="Username must contain only letters, numbers, and underscores.")
    if len(value) < 2:
        raise HTTPException(status_code=400, detail="Username must be at least 2 characters long.")
    if len(value) > 50:
        raise HTTPException(status_code=400, detail="Username must be at most 50 characters long.")
    return value

def validate_email(value: str) -> str:
    if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", value):
        raise HTTPException(status_code=400, detail="Invalid email address format.")
    return value
