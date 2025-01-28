from sqlmodel import SQLModel, Field
from datetime import date
from pydantic import field_validator
from typing import Optional, Annotated, TYPE_CHECKING
from sqlalchemy import Enum as SQLAlchemyEnum

from enums import ImpactTypeEnum


if TYPE_CHECKING:
    from models.UserModels import UserModel
    from models.ProjectModels import ProjectModel

class ImpactModel(SQLModel, table=True):
    __tablename__ = "impact"
    
    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        return v.title() if v else v

    id: Optional[int] = Field(default=None, primary_key=True)
    title: Annotated[str, (0, 50)] = Field(..., max_length=50)
    description: Annotated[str, (0, 500)] = Field(..., max_length=500)
    type: ImpactTypeEnum
    impactPercent: Annotated[float, 100] = Field(...)
    worker_id: int = Field(..., foreign_key="user.id")
    project_id: int = Field(..., foreign_key="project.id")
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)
