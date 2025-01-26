from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional, Annotated

from models.UserModels import UserModel

class ProjectModel(SQLModel, table=True):
    __tablename__ = "project"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Annotated[str, (0, 50)] = Field(..., max_length=50)
    founder_id: int = Field(..., foreign_key="user.id")
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)
