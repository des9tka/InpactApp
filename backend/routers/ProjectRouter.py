from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlmodel import Session
from typing import Optional, List

from core.db import get_session 
from core.tokens import oauth2_bearer
from models import ProjectModel, UserModel
from repository import ProjectRepository
from enums import UpdateProjectDataEnum

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

# Get User Projects
@project_router.get('/')
async def get_user_projects(
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
):
	return await ProjectRepository.get_user_projects(
		session=session,
		token=token
)

# Get Invited Projects;
@project_router.get('/invited-projects')
async def get_invited_projects(
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
):
	return await ProjectRepository.get_invited_projects(
		session=session,
		token=token
	)

# Join Team;
@project_router.get('/join-team')
async def join_team(
	session: Session = Depends(get_session),
	invite_token: str = Depends(oauth2_bearer),
):
	return await ProjectRepository.join_team(
		session=session,
		invite_token=invite_token
	)


# Invite User To Project;
@project_router.get('/{project_id}/add-user/{user_id}')
async def add_user_to_project(
	background_tasks: BackgroundTasks,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer),
	project_id: Optional[str] = None,
	user_id: Optional[str] = None
):
	return await ProjectRepository.add_user_to_project(
		session=session,
		token=token,
		project_id=project_id,
		user_id=user_id,
		background_tasks=background_tasks
	)


@project_router.delete('/{project_id}/delete-user/{projectUser_id}')
async def delete_user_from_project(
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer),
	project_id: Optional[str] = None,
	projectUser_id: Optional[str] = None
):
	return await ProjectRepository.delete_user_from_project(
		session=session,
		token=token,
		project_id=project_id,
		projectUser_id=projectUser_id
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

@project_router.delete("/delete/{project_id}")
async def delete_project(
	project_id: int, 
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> None:
	return await ProjectRepository.delete_project(
		session=session,
		token=token,
		project_id=project_id
	)

@project_router.patch("/update/{project_id}")
async def update_project(
	project_data: UpdateProjectDataEnum,
	project_id: int,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> ProjectModel:
	return await ProjectRepository.update_project(
		session=session,
		token=token,
		project_id=project_id,
		project_data=project_data
	)

@project_router.get("/{project_id}")
async def get_project_by_id(
	project_id: str,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> ProjectModel:
	return await ProjectRepository.get_project_by_id(
		session=session,
		token=token,
		project_id=project_id
)
