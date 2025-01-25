from sqlmodel import SQLModel, Field, Relationship
from datetime import date
from typing import List, Optional, Annotated

from .ProjectModels import ProjectRetrieve
from .InpactModels import InpactRetrieve


class UserBase(SQLModel):
    email: Optional[str] = Field(...)
    username: Annotated[str, (0, 50)] = Field(..., max_length=50)
    name: Annotated[str, 50] = Field(default=None, max_length=50)
    surname: Annotated[str, 50] = Field(default=None, max_length=50)
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)

class UserCreate(UserBase):
    pass

class UserRetrieve(UserBase, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    projects: List["ProjectRetrieve"] = Relationship(back_populates="workers")
    inpacts: List["InpactRetrieve"] = Relationship(back_populates="worker")
