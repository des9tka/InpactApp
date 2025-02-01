from sqlmodel import Session
from fastapi import HTTPException, BackgroundTasks
import bcrypt
from starlette.concurrency import run_in_threadpool

from models.UserModels import UserModel
from core.tokens import create_access_refresh_tokens, refresh_access_token, validate_token, create_activate_token, create_recovery_token, is_allowed_request
from core.redis.redis_services import remove_tokens
from services import send_activate_email, send_recovery_email


class AuthRepository:
    # Login User;
    @classmethod
    async def login(cls, session, login_data, background_tasks) -> dict:
        
        user = await run_in_threadpool(
    		lambda: UserModel.get_user_by(
                session=session, 
                email=login_data.email, 
            )
		)
        
        if not user or not bcrypt.checkpw(login_data.password.encode('utf-8'), user.password.encode('utf-8')):
            raise HTTPException(status_code=400, detail="Invalid email or password.")

        if not user.is_active:
            if not await is_allowed_request(user_id=user.id, token_type="activate"):
                raise HTTPException(
                   status_code=429,
                   detail="Activation link already sent to your email."
                )
            
            activate_token = await create_activate_token(user_id=user.id)
            await send_activate_email(background_tasks=background_tasks, user_email=user.email,activate_token=activate_token)
            raise HTTPException(status_code=400, detail="You are not activate your account, please activate through email.")
    
        tokens = await create_access_refresh_tokens(user_id=user.id)
        return tokens
        return True
    
	# Register User;
    @classmethod
    async def register(
        cls,
        session: Session,
        user_data: UserModel,
        background_tasks: BackgroundTasks 
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
        
        hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt()).decode("utf-8")

        user = await run_in_threadpool(
    		lambda: UserModel.create_user(
                session=session, 
                user_data=user_data, 
                hashed_password=hashed_password
            )
		)

        activate_token = await create_activate_token(user_id=user.id)
        await send_activate_email(activate_token=activate_token, user_email=user.email, background_tasks=background_tasks)
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

    # Activate User by Token;
    @classmethod
    async def activate_user(cls, session: Session, activate_token: str) -> bool:
        user_id = await validate_token(token=activate_token)
        user = UserModel.get_user_by(session=session, id=user_id)
        if user.is_active:
            raise HTTPException(status_code=400, detail="You already activated your account")
            
        user.is_active = True
        session.commit()
        await remove_tokens(activate_token=True, user_id=user.id)
        return {"detail": "You successfully activated your account"}

    # Request Recovery Password by Email;
    @classmethod
    async def request_recovery_password(cls, session: Session, email: str, background_tasks: BackgroundTasks) -> bool:
        user = UserModel.get_user_by(session=session, email=email)

        if not user:
            raise HTTPException(status_code=404, detail="Invalid email")

        if not await is_allowed_request(user_id=user.id, token_type="recovery"):
            raise HTTPException(
                status_code=429,
                detail="Recovery code already sent to your email"
            )

        recovery_token = await create_recovery_token(user_id=user.id)
        
        await send_recovery_email(
            user_email=user.email,
            background_tasks=background_tasks,
            recovery_token=recovery_token
        )

        return {"detail": "Recovery code sent to your email. It will be active 10 minutes"}

    # Recovery Password by Token;
    @classmethod
    async def recovery_password(cls, session: Session, password: str, recovery_token: str) -> bool:
        user_id = await validate_token(token=recovery_token)
        user = UserModel.get_user_by(session=session, id=user_id)

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode("utf-8")

        user.password = hashed_password
        session.commit()
        return {"detail": "You successfully changed your password"}
