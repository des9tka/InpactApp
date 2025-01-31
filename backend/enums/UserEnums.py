from pydantic import BaseModel, root_validator, validator
from fastapi import HTTPException, status
from typing import Optional, ClassVar
import re


class LoginUserEnum(BaseModel):
	email: str
	password: str

class RegisterUserEnum(BaseModel):
	email: str
	password: str
	username: str
	name: Optional[str]
	surname: Optional[str]

class RecoveryPasswordRequestEnum(BaseModel):
	email: str

class RecoveryDataEnum(BaseModel):
    recovery_token: str
    password: str

    PASSWORD_REGEX: ClassVar[str] = '^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{4,20}$'

    @validator('password')
    def validate_password(cls, value):
        if value and not re.match(cls.PASSWORD_REGEX, value):
            raise ValueError("Password does not meet the required criteria.")
        return value

class UpdateUserDataEnum(BaseModel):
	name: Optional[str] = None
	username: Optional[str] = None
	surname: Optional[str] = None
