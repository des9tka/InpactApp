from sqlmodel import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from starlette.concurrency import run_in_threadpool
from typing import List

from models.UserModels import UserModel
from core.tokens import verify_token


class UserRepository:
	# Get All Users;
	@classmethod
	async def get_all_users(
        cls,
		token,
        session
    ) -> List[UserModel]:
		await verify_token(token)

		users = await run_in_threadpool(
    		lambda: UserModel.get_all_users(
                session=session, 
            )
		)

		return users
