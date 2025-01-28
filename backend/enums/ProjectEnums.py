from enum import Enum
from pydantic import BaseModel
from typing import Optional


class UpdateProjectDataEnum(BaseModel):
	name: Optional[str] = None