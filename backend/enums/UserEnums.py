from pydantic import BaseModel
from typing import Optional

class LoginUserEnum(BaseModel):
	email: str
	password: str

class RegisterUserEnum(BaseModel):
	email: str
	password: str
	username: str
	name: Optional[str]
	surname: Optional[str]

class RecoveryPasswordEnum(BaseModel):
	email: str

class UpdateUserDataEnum(BaseModel):
	name: Optional[str] = None
	username: Optional[str] = None
	surname: Optional[str] = None