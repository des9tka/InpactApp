from sqlmodel import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from starlette.concurrency import run_in_threadpool

from models.UserModels import UserModel
from core.tokens import create_access_refresh_tokens, refresh_access_token, validate_token, create_activate_token, create_recovery_token
from services import send_activate_email


class AuthRepository:
    # Login User;
    @classmethod
    async def login(cls, session, login_data) -> dict:
        
        user = await run_in_threadpool(
    		lambda: UserModel.get_user_by(
                session=session, 
                email=login_data.email, 
            )
		)
        
        if not user or not bcrypt.verify(login_data.password, user.password):
            raise HTTPException(status_code=400, detail="Invalid email or password.")
        
        tokens = await create_access_refresh_tokens(user_id=user.id)
        return tokens
        return True
    
	# Register User;
    @classmethod
    async def register(
        cls,
        session: Session,
        user_data: UserModel
    ) -> UserModel:
        
        required_fields = {
            "email": user_data.email,
            "password": user_data.password,
            "username": user_data.username
        }
        
        missing_fields = [field for field, value in required_fields.items() if not value]

        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        hashed_password = bcrypt.hash(user_data.password)

        user = await run_in_threadpool(
    		lambda: UserModel.create_user(
                session=session, 
                user_data=user_data, 
                hashed_password=hashed_password
            )
		)

        await send_activate_email(user_id=user.id, user_email=user.email)
        return user

    #Refresh User tokens;
    @classmethod
    async def refresh(cls, refresh_token: str) -> str:
        tokens = await refresh_access_token(refresh_token=refresh_token)
        return tokens

     #Get Self Info by Token;
    @classmethod
    async def get_info(cls, access_token: str, session: Session) -> str:
        user_id = await validate_token(token=access_token)
        user = UserModel.get_user_by(session=session, id=user_id)
        return user