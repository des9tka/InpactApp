from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import List, Optional, Annotated

from .UserModels import UserRetrieve
from .InpactModels import InpactRetrieve


class ProjectBase(SQLModel):
    name: Annotated[str, (0, 50)] = Field(..., max_length=50)
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)
    
class ProjectCreate(ProjectBase):
    pass

class ProjectRetrieve(ProjectBase, table=True):
    __tablename__ = "project"

    id: Optional[int] = Field(default=None, primary_key=True)
    founder_id: Optional[int] = Field(foreign_key="user.id")
    founder: Optional[UserRetrieve] = Relationship(back_populates="projects")
    workers: List[UserRetrieve] = Relationship(back_populates="projects") 
    inpacts: List[InpactRetrieve] = Relationship(back_populates="project")
