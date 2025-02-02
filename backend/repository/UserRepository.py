from sqlmodel import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from starlette.concurrency import run_in_threadpool
from typing import List, Optional

from models.UserModels import UserModel
from core.tokens import validate_token


class UserRepository:
    # Get user by ID, email, or username
    @classmethod
    async def get_user_by(
        cls,
        session,
        token,
        id,
        email,
        username
    ) -> List[UserModel]:
        # Validate the provided token
        await validate_token(token)

        # Ensure at least one of id, email, or username is provided
        if not any([id, email, username]):
            return []
        
        # Fetch user based on provided criteria
        def fetch_users():
            user = None
            if id:
                user = UserModel.get_user_by(session=session, id=id)
            elif email:
                user = UserModel.get_user_by(session=session, email=email)
            elif username:
                user = UserModel.get_user_by(session=session, username=username)
            
            return [user] if user else []
        
        # Run the database query in a background thread
        users = await run_in_threadpool(fetch_users)
        return users
    
    # Update User data
    @classmethod
    async def update_user(cls, session, user_data, token):
        # Ensure that user data is provided
        if not user_data:
            raise HTTPException(status_code=400, detail="Missing user data to update.")
        
        # Validate the provided token and get the user ID
        user_id = await validate_token(token)
        
        # Update the user's information in the database
        return UserModel.update_user(session=session, user_id=user_id, user_data=user_data)
    
    # Get all users
    @classmethod
    async def get_all_users(cls, session):
        # Retrieve all users from the database
        return UserModel.get_all_users(session=session)
