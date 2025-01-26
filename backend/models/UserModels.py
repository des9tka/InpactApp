from sqlmodel import SQLModel, Field, Session
from typing import Optional, Annotated
from datetime import date

from services.UserServices import getUserByService, createUserService


class UserModel(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: Annotated[str, (0, 100)] = Field(..., unique=True)
    password: Annotated[str, (0, 100)] = Field(..., exclude=True)
    username: Annotated[str, (0, 50)] = Field(..., max_length=50, unique=True)
    name: Optional[str] = Field(default=None, max_length=50)
    surname: Optional[str] = Field(default=None, max_length=50)
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)


    @classmethod
    def createUser(cls, session: Session, user_data, hashed_password):
        return createUserService(
            session=session,
            user_data=user_data,
            hashed_password=hashed_password
        )

    @classmethod
    def getUserBy(cls, session: Session, id=None, email=None, username=None):
        return getUserByService(
            session, 
            id, 
            email, 
            username
        )
