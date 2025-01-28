from sqlmodel import Session, select, or_
from sqlalchemy.sql.expression import func
from sqlalchemy.exc import IntegrityError
from typing import Optional
from datetime import date
from fastapi import HTTPException


class UserServicesStore:

    # Create User
    @classmethod
    def createUserService(cls, session: Session, user_data, hashed_password):
        from models import UserModel
        
        existing_user = session.query(UserModel).filter(
            (UserModel.email == user_data.email) | (UserModel.username == user_data.username)
        ).first()

        if existing_user:
            if existing_user.email == user_data.email:
                raise HTTPException(
                    status_code=400, detail="Email already exists. Please use a different email address."
                )
            if existing_user.username == user_data.username:
                raise HTTPException(
                    status_code=400, detail="Username already exists. Please choose a unique username."
                )

        user = UserModel(
            email=user_data.email,
            password=hashed_password,
            username=user_data.username,
            name=user_data.name,
            surname=user_data.surname
        )

        session.add(user)
        try:
            session.commit()  # Try to save changes
            session.refresh(user)
        except IntegrityError as e:
            session.rollback()  # Back to the previous transaction
            if "UNIQUE constraint failed: user.email" in str(e.orig):
                raise HTTPException(
                    status_code=400, detail="Email already exists. Please use a different email address."
                )
            elif "UNIQUE constraint failed: user.username" in str(e.orig):
                raise HTTPException(
                    status_code=400, detail="Username already exists. Please choose a unique username."
                )
            else:
                raise HTTPException(
                    status_code=500, detail="An unexpected database error occurred."
                )

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

    # Update User
    @classmethod
    def updateUserService(cls, session: Session, user_data, user_id):
        from models import UserModel

        user = session.get(UserModel, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.username = user_data.username if user_data.username else user.username
        user.name = user_data.name if user_data.name else user.name
        user.surname = user_data.surname if user_data.surname else user.surname

        if any([user_data.username, user_data.name, user_data.surname]):
            user.updated_at = date.today()

        try:
            session.commit() 
            session.refresh(user)
        except IntegrityError as e:
            session.rollback()
            if "UNIQUE constraint failed" in str(e.orig):
                raise HTTPException(
                    status_code=400, detail="Username already exists. Please choose a unique username."
                )
            raise HTTPException(
                status_code=500, detail="An unexpected database error occurred."
            )

        return user
