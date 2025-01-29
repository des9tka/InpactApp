from sqlmodel import SQLModel, Field, Session, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import date

from services import UserServicesStore
from models.RelationsModels import UserProjectModel

if TYPE_CHECKING:
    from models import ProjectModel


class UserModel(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(..., min_length=2, unique=True)
    password: str = Field(..., min_length=2, max_length=100, exclude=True)
    username: str = Field(..., min_length=2, max_length=50, unique=True)
    name: Optional[str] = Field(default=None, min_length=2, max_length=50)
    surname: Optional[str] = Field(default=None, min_length=2, max_length=50)
    is_active: Optional[bool] = Field(default=False)
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)

    projects: List["ProjectModel"] = Relationship(back_populates="users", link_model=UserProjectModel)

    class Config:
        from_attributes = True

    @classmethod
    def create_user(cls, session: Session, user_data, hashed_password):
        return UserServicesStore.createUserService(
            session=session,
            user_data=user_data,
            hashed_password=hashed_password
        )

    @classmethod
    def get_user_by(cls, session: Session, 
        id: Optional[int]=None, 
        email:Optional[str]=None, 
        username:Optional[str]=None
    ):
        return UserServicesStore.getUserByService(
            session, 
            id,
            email,
            username
        )
    
    @classmethod
    def get_all_users(cls, session: Session):
        return UserServicesStore.getAllUsersService(
            session
        )
    
    @classmethod
    def update_user(cls, session: Session, user_id, user_data):
        return UserServicesStore.updateUserService(
            session=session,
            user_data=user_data,
            user_id=user_id
        )
