from sqlmodel import SQLModel, Field, Session
from datetime import date
from pydantic import field_validator
from typing import Optional, Annotated, TYPE_CHECKING
from sqlalchemy import Enum as SQLAlchemyEnum

from enums import ImpactTypeEnum
from services import ImpactServiceStore


if TYPE_CHECKING:
    from models.UserModels import UserModel
    from models.ProjectModels import ProjectModel

class ImpactModel(SQLModel, table=True):
    __tablename__ = "impact"
    
    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        return v.upper() if v else v

    id: Optional[int] = Field(default=None, primary_key=True)
    title: Annotated[str, (0, 50)] = Field(..., max_length=50)
    description: Annotated[str, (0, 500)] = Field(..., max_length=500)
    type: ImpactTypeEnum
    impactPercent: Annotated[float, 100] = Field(...)
    user_id: int = Field(..., foreign_key="user.id")
    project_id: int = Field(..., foreign_key="project.id")
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)

    class Config:
        from_attributes = True

    @classmethod
    def create_impact(cls, session: Session, impact_data):
        return ImpactServiceStore.createImpactService(
            session=session,
            impact_data=impact_data,
    )

    @classmethod
    def update_impact(cls, session: Session, impact_data, impact_id: int):
        return ImpactServiceStore.updateImpactService(
            session=session,
            impact_data=impact_data,            
            impact_id=impact_id
        )
