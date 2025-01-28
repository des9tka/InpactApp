from pydantic import BaseModel

class AdminKeyEnum(BaseModel):
	admin_key: str