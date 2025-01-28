from sqlmodel import SQLModel, Field, Session, Relationship
from typing import Optional, Annotated, List, TYPE_CHECKING
from datetime import date

from services import UserServicesStore
from models.RelationsModels import UserProjectModel

if TYPE_CHECKING:
    from models import ProjectModel


class UserModel(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: Annotated[str, (0, 100)] = Field(..., unique=True)
    password: Annotated[str, (0, 100)] = Field(..., exclude=True)
    username: Annotated[str, (0, 50)] = Field(..., max_length=50, unique=True)
    name: Optional[str] = Field(default=None, max_length=50)
    surname: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = Field(default=False)
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)

    projects: List["ProjectModel"] = Relationship(back_populates="users", link_model=UserProjectModel)

    @classmethod
    def create_user(cls, session: Session, user_data, hashed_password):
        return UserServicesStore.createUserService(
            session=session,
            user_data=user_data,
            hashed_password=hashed_password
        )

    @classmethod
    def get_user_by(cls, session: Session, id=None, email=None, username=None):
        return UserServicesStore.getUserByService(
            session, 
            id, 
            email, 
            username
        )
    
    @classmethod
    def get_all_users(cls, session: Session, id=None, email=None, username=None):
        return UserServicesStore.getAllUsersService(
            session
        )
