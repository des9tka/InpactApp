from sqlmodel import SQLModel, Field, Session
from datetime import date
from pydantic import field_validator
from typing import Optional, Annotated, TYPE_CHECKING
from sqlalchemy import Enum as SQLAlchemyEnum
from enums import ImpactTypeEnum
from services import ImpactServiceStore


if TYPE_CHECKING:
    # Importing UserModel and ProjectModel only for type checking
    from models.UserModels import UserModel
    from models.ProjectModels import ProjectModel

class ImpactModel(SQLModel, table=True):
    # Define the table "impact" in the database
    __tablename__ = "impact"
    
    # Validator for 'type' field to always store it in uppercase
    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        return v.upper() if v else v

    # Validator for 'impactPercent' field to ensure the value is between 0 and 100
    @field_validator('impactPercent')
    @classmethod
    def validate_impact_percent(cls, v):
        if v < 0 or v > 100:
            raise ValueError('Impact percentage must be between 0 and 100')
        return v

    # Define the model fields
    id: Optional[int] = Field(default=None, primary_key=True)  # Primary key, auto-incremented ID
    title: Annotated[str, (0, 50)] = Field(..., max_length=50)  # Title field with max length of 50
    description: Annotated[str, (0, 500)] = Field(..., max_length=500)  # Description field with max length of 500
    type: ImpactTypeEnum  # Enum for impact type
    impactPercent: Annotated[float, 100] = Field(...)  # Impact percentage, must be between 0 and 100
    user_id: int = Field(..., foreign_key="user.id")  # Foreign key to user model
    project_id: int = Field(..., foreign_key="project.id")  # Foreign key to project model
    created_at: Optional[date] = Field(default_factory=date.today)  # Timestamp of when the impact was created
    updated_at: Optional[date] = Field(default=None)  # Timestamp for when the impact was last updated

    class Config:
        from_attributes = True  # Allows Pydantic models to be populated from SQLModel attributes

    # Class method to create an impact record in the database
    @classmethod
    def create_impact(cls, session: Session, impact_data):
        return ImpactServiceStore.createImpactService(
            session=session,
            impact_data=impact_data,
    )

    # Class method to update an impact record in the database
    @classmethod
    def update_impact(cls, session: Session, impact_data, impact_id: int):
        return ImpactServiceStore.updateImpactService(
            session=session,
            impact_data=impact_data,            
            impact_id=impact_id
        )
    
    # Class method to delete an impact record from the database
    @classmethod
    def delete_impact(cls, session: Session, impact_id: int):
        return ImpactServiceStore.deleteImpactService(
            session=session,
            impact_id=impact_id
        )
