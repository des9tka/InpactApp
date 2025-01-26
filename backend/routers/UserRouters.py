from fastapi import APIRouter, Depends
from sqlmodel import Session
from core.db import get_session 
from typing import List 

from models.UserModels import UserModel
from repository import UserRepository
from core.tokens import oauth2_bearer


user_router = APIRouter(
	prefix="/users",
	tags=["user"]
)

@user_router.get("/")
async def get_all_users(
	token: str = Depends(oauth2_bearer),
	session: Session = Depends(get_session)
) -> List[UserModel]:
	return await UserRepository.get_all_users(session)