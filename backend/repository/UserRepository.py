from sqlmodel import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from starlette.concurrency import run_in_threadpool
from typing import List, Optional

from models.UserModels import UserModel
from core.tokens import validate_token


class UserRepository:
	# Get All Users;
	@classmethod
	async def get_user_by(
        cls,
        session,
		token,
		id,
		email,
		username
    ) -> List[UserModel]:
            
		await validate_token(token)

		if not any([id, email, username]):
			return []
    
		def fetch_users():
			user = None
			if id:
				user = UserModel.get_user_by(session=session, id=id)
			elif email:
				user = UserModel.get_user_by(session=session, email=email)
			elif username:
				user = UserModel.get_user_by(session=session, username=username)
				
			return [user] if user else []
		
		users = await run_in_threadpool(fetch_users)
		return users
	
	# Update User;
	@classmethod
	async def update_user(cls, session, user_data, token):
		if not user_data:
			raise HTTPException(status_code=400, detail="Missing user data to update.")
		
		user_id = await validate_token(token)
		return UserModel.update_user(session=session, user_id=user_id, user_data=user_data)
	
	# Get all Users;
	@classmethod
	async def get_all_users(cls, session):
		return UserModel.get_all_users(session=session)