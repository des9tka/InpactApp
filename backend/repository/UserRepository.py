from sqlmodel import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from starlette.concurrency import run_in_threadpool
from typing import List

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
		users = []

		if not any([id, email, username]):
			return []
		
		def fetch_users():
			if id:
				return UserModel.get_user_by(session=session, id=id)
			if email:
				return UserModel.get_user_by(session=session, email=email)
			if username:
				return UserModel.get_user_by(session=session, username=username)

		users = await run_in_threadpool(
    		lambda: fetch_users() 
		)

		return users
