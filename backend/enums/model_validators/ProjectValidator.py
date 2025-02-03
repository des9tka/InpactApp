from fastapi import HTTPException
import re


def validate_project_name(value: str) -> str:
    if not re.match(r"^[a-zA-Z0-9_]+$", value):
        raise HTTPException(status_code=400, detail="Project name must contain only letters, numbers, and underscores.")
    if len(value) < 2:
        raise HTTPException(status_code=400, detail="Project name must be at least 2 characters long.")
    if len(value) > 50:
        raise HTTPException(status_code=400, detail="Project name must be at most 50 characters long.")
    return value