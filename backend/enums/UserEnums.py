from enum import Enum
from pydantic import BaseModel


class LoginUserEnum(BaseModel):
	email: str
	password: str
