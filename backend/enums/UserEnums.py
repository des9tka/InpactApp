from pydantic import BaseModel
from typing import Optional

class LoginUserEnum(BaseModel):
	email: str
	password: str

class UpdateUserDataEnum(BaseModel):
	name: Optional[str] = None
	username: Optional[str] = None
	surname: Optional[str] = None