from fastapi import APIRouter, Depends, Request
from sqlmodel import Session
from typing import List, Optional

from core.db import get_session 
from core.tokens import oauth2_bearer
from models.UserModels import UserModel
from repository import UserRepository
from enums import UpdateUserDataEnum
from core.limiter import limiter


# User Router for handling user-related routes
user_router = APIRouter(
	prefix="/users",
	tags=["users"]
)

# Get user by ID, username, or email; returns a list of users that match the criteria
@user_router.get("/")
async def get_user_by(
	request: Request,
	id: Optional[int] = None,
	username: Optional[str] = None,
	email: Optional[str] = None,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> List[UserModel]:
	return await UserRepository.get_user_by(
		session=session,
		token=token,
		id=id,
		email=email,
		username=username	
	)

# Update user data using the provided user data enum; returns the updated user
@user_router.patch('/update')
@limiter.limit("1/hour", per_method=True)
async def update_user(
	request: Request,
	user_data: UpdateUserDataEnum,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> UserModel:	
	return await UserRepository.update_user(
		session=session,
		token=token,
		user_data=user_data
	)

# Get all users in the system; returns a list of all users
@user_router.get('/all')
async def get_all_users(session: Session = Depends(get_session)) -> List[UserModel]:
	return await UserRepository.get_all_users(session=session)
