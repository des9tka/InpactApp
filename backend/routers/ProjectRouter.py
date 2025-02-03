from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlmodel import Session
from typing import Optional, List

from core.db import get_session 
from core.tokens import oauth2_bearer
from models import ProjectModel, UserModel
from repository import ProjectRepository
from enums import UpdateProjectDataEnum
from core.limiter import limiter


# Project Router for handling project-related routes
project_router = APIRouter(
	prefix="/projects",
	tags=["projects"]
)

# Create a new project; returns the created project
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

# Get all projects that the user is part of; returns a list of projects
@project_router.get('/')
async def get_user_projects(
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
):
	return await ProjectRepository.get_user_projects(
		session=session,
		token=token
)

# Get projects that the user has been invited to; returns a list of invited projects
@project_router.get('/invited-projects')
@limiter.limit("1/minute", per_method=True)
async def get_invited_projects(
	request: Request,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
):
	return await ProjectRepository.get_invited_projects(
		session=session,
		token=token
	)

# Join a project using an invitation token
@project_router.get('/join-team/{invite_token}')
async def join_team(
	invite_token: str,
	session: Session = Depends(get_session),
):
	return await ProjectRepository.join_team(
		session=session,
		invite_token=invite_token
	)

# Invite a user to a project by their user ID; sends an invitation in the background
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

# Remove a user from a project by their projectUser_id
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

# Get a list of users associated with a project by project_id
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

# Delete a project by its project_id
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

# Update project information using the provided data and project_id
@project_router.patch("/update/{project_id}")
@limiter.limit("1/hour", per_method=True)
async def update_project(
	request: Request,
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

# Get a project by its project_id
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
