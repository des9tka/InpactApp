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
        
        # Check if the email or username already exists in the database
        existing_user = session.query(UserModel).filter(
            (UserModel.email == user_data.email) | (UserModel.username == user_data.username)
        ).first()

        # Raise error if the user already exists with the provided email or username
        if existing_user:
            if existing_user.email == user_data.email:
                raise HTTPException(
                    status_code=400, detail="Email already exists. Please use a different email address."
                )
            if existing_user.username == user_data.username:
                raise HTTPException(
                    status_code=400, detail="Username already exists. Please choose a unique username."
                )

        # Create a new user with the provided data
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
            session.refresh(user)  # Refresh user to get the latest data from the DB
        except IntegrityError as e:
            session.rollback()  # Rollback in case of any database error
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


    # Get User By Params
    @classmethod
    def getUserByService(cls, session: Session, 
        id: Optional[int]=None, 
        email:Optional[str]=None, 
        username:Optional[str]=None
    ):
        from models import UserModel

        if not session: return

        # Build query with dynamic filtering based on the provided parameters
        query = select(UserModel).where(
            or_(
                UserModel.id == id if id else False,
                func.lower(UserModel.email).like(f"%{email.lower()}%") if email else False,
                func.lower(UserModel.username).like(f"%{username.lower()}%") if username else False
            )
        )
        user = session.exec(query).first()  # Execute query and get the first matching result
        return user

    # Get All Users
    @classmethod
    def getAllUsersService(cls, session):
        from models import UserModel

        # Retrieve all users from the database
        return session.exec(select(UserModel)).all()

    # Update User
    @classmethod
    def updateUserService(cls, session: Session, user_data, user_id):
        from models import UserModel

        # Fetch the user to update
        user = session.get(UserModel, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update the user's fields if new data is provided
        user.username = user_data.username if user_data.username else user.username
        user.name = user_data.name if user_data.name else user.name
        user.surname = user_data.surname if user_data.surname else user.surname

        # If any fields are updated, set the updated_at field to today's date
        if any([user_data.username, user_data.name, user_data.surname]):
            user.updated_at = date.today()

        try:
            session.commit()  # Try to save the changes to the database
            session.refresh(user)  # Refresh the user object with the latest data
        except IntegrityError as e:
            session.rollback()  # Rollback in case of any error
            if "UNIQUE constraint failed" in str(e.orig):
                raise HTTPException(
                    status_code=400, detail="Username already exists. Please choose a unique username."
                )
            raise HTTPException(
                status_code=500, detail="An unexpected database error occurred."
            )

        return user
