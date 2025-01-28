from sqlmodel import Session, select, or_
from sqlalchemy.sql.expression import func
from typing import Optional


class UserServicesStore:
    # Create User;
    @classmethod
    def createUserService(cls, session: Session, user_data, hashed_password):
        from models import UserModel
        user = UserModel(
            email=user_data.email,
            password=hashed_password,
            username=user_data.username,
            name=user_data.name,
            surname=user_data.surname
        )

        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    # Get User By Params;
    @classmethod
    def getUserByService(cls, session: Session, 
        id: Optional[int]=None, 
        email:Optional[str]=None, 
        username:Optional[str]=None
    ):
        from models import UserModel

        if not session: return

        query = select(UserModel).where(
            or_(
                UserModel.id == id if id else False,
                func.lower(UserModel.email).like(f"%{email.lower()}%") if email else False,
                func.lower(UserModel.username).like(f"%{username.lower()}%") if username else False
            )
        )
        return session.exec(query).first()

    # Get All Users;
    @classmethod
    def getAllUsersService(cls, session):
        from models import UserModel
        return session.exec(select(UserModel)).all()
