from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from pydantic import field_validator
from typing import List, Optional, Annotated

from enums.InpactEnums import InpactTypeModel
from .UserModels import UserRetrieve
from .ProjectModels import ProjectRetrieve


class InpactBase(SQLModel):
    title: Annotated[str, (0, 50)] = Field(..., max_length=50)
    description: Annotated[str, (0, 500)] = Field(..., max_length=500)
    type: Optional[InpactTypeModel] = Field(default=InpactTypeModel.FEAT)
    inpactPercent: Annotated[float, 100] = Field(default=None)
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)

class InpactCreate(InpactBase):
    @field_validator("type")
    def validate_type(cls, value: InpactBase):
        if value: return value.title()
    

class InpactRetrieve(InpactBase, table=True):
    __tablename__ = "inpacts"

    id: Optional[int] = Field(default=None, primary_key=True)
    worker_id: Optional[int] = Field(foreign_key="user.id")
    worker: Optional[UserRetrieve] = Relationship(back_populates="inpacts")
    project_id: Optional[int] = Field(foreign_key="project.id")
    project: Optional[ProjectRetrieve] = Relationship(back_populates="inpacts")
