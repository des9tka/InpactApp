from sqlmodel import Session
from fastapi import APIRouter, Depends, Body, BackgroundTasks, Request
from typing import TYPE_CHECKING

from core.db import get_session
from repository.AuthRepository import AuthRepository
from models.UserModels import UserModel
from enums.UserEnums import LoginUserEnum
from core.tokens import oauth2_bearer
from enums import RegisterUserEnum, RecoveryPasswordRequestEnum, RecoveryDataEnum
from core.limiter import limiter

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@auth_router.post("/login")
@limiter.limit("6/minute", per_method=True)
async def login(
	request: Request,
	background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    login_data: LoginUserEnum = Body(...), 
):
    return await AuthRepository.login(session=session, login_data=login_data, background_tasks=background_tasks)

@auth_router.post("/register")
@limiter.limit("1/minute", per_method=True)
async def register(
	request: Request,
    user_data: RegisterUserEnum, 
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
) -> UserModel:
    return await AuthRepository.register(session=session, user_data=user_data, background_tasks=background_tasks)


@auth_router.post("/refresh")
@limiter.limit("1/hour", per_method=True)
async def refresh(
	request: Request,
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
	request: Request,
    activate_token: str,
    session: Session = Depends(get_session)
):
    return await AuthRepository.activate_user(activate_token=activate_token, session=session)

@auth_router.post("/recovery_request")
@limiter.limit("4/day", per_method=True)
async def recovery_request(
	request: Request,
    background_tasks: BackgroundTasks,
    email_data: RecoveryPasswordRequestEnum,
    session: Session = Depends(get_session)
):
    return await AuthRepository.request_recovery_password(
        email=email_data.email, 
        session=session, 
        background_tasks=background_tasks
    )

@auth_router.post("/recovery")
@limiter.limit("4/day", per_method=True)
async def recovery(
    request: Request,
    recovery_data: RecoveryDataEnum,
    session: Session = Depends(get_session)
):
    return await AuthRepository.recovery_password(
        recovery_token=recovery_data.recovery_token,
        session=session,
        password=recovery_data.password
    )
