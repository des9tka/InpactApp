from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List, Optional

from core.db import get_session 
from core.tokens import oauth2_bearer
from models.UserModels import UserModel
from repository import UserRepository


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
