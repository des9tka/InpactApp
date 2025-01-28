from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List, Optional

from core.db import get_session 
from core.tokens import oauth2_bearer
from models.UserModels import UserModel
from repository import UserRepository
from enums.UserEnums import UpdateUserDataEnum

# User Router; 
user_router = APIRouter(
	prefix="/users",
	tags=["users"]
)

# Get User by Params;
@user_router.get("/")
async def get_user_by(
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

@user_router.patch('/update')
async def update_user(
	user_data: UpdateUserDataEnum,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> UserModel:	
	return await UserRepository.update_user(
		session=session,
		token=token,
		user_data=user_data
	)

@user_router.get('/all')
async def get_all_users(session: Session = Depends(get_session)) -> List[UserModel]:
	return await UserRepository.get_all_users(session=session)