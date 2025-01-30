from sqlmodel import Session
from fastapi import APIRouter, Depends, Body

from core.db import get_session
from repository.AuthRepository import AuthRepository
from models.UserModels import UserModel
from enums.UserEnums import LoginUserEnum
from core.tokens import oauth2_bearer


auth_router = APIRouter(
	prefix="/auth",
	tags=["auth"]
)

@auth_router.post("/login")
async def login(
	session: Session = Depends(get_session),
	login_data: LoginUserEnum = Body(...), 
):
	return await AuthRepository.login(session=session, login_data=login_data)

@auth_router.post("/register")
async def register(
	user_data: UserModel, 
	session: Session = Depends(get_session)
) -> UserModel:
	return await AuthRepository.register(session=session, user_data=user_data)

@auth_router.post("/refresh")
async def refresh(
	refresh_token: str = Depends(oauth2_bearer),
):
	return await AuthRepository.refresh(refresh_token=refresh_token)

@auth_router.get("/get-info")
async def refresh(
	access_token: str = Depends(oauth2_bearer),
	session: Session = Depends(get_session)
):
	return await AuthRepository.get_info(access_token=access_token, session=session)

@auth_router.get("/activate/{activate_token}")
async def activate(
	activate_token: str = Depends(oauth2_bearer),
	session: Session = Depends(get_session)
):
	return await AuthRepository.activate_user(activate_token=activate_token, session=session)