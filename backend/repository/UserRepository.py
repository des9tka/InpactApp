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
	 	