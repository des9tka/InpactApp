from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Optional, List

from core.db import get_session 
from core.tokens import oauth2_bearer
from models import ProjectModel, UserModel
from repository import ProjectRepository


# Project Router;
project_router = APIRouter(
	prefix="/projects",
	tags=["projects"]
)

# Create Project;
@project_router.post("/")
async def create_project(
	project_data: ProjectModel,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> ProjectModel:
	return await ProjectRepository.create_project(
		session=session,
		token=token,
		project_data=project_data,
	)

@project_router.get('/{project_id}/add-user/{user_id}')
async def add_user_to_project(
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer),
	project_id: Optional[str] = None,
	user_id: Optional[str] = None
):
	return await ProjectRepository.add_user_to_project(
		session=session,
		token=token,
		project_id=project_id,
		user_id=user_id
	)

@project_router.get("/{project_id}/get-users")
async def get_users_from_project(
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer),
	project_id: Optional[str] = None
) -> List[UserModel]:
	return await ProjectRepository.get_users_from_project(
		session=session,
		token=token,
		project_id=project_id
	)
