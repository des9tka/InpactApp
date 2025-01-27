from fastapi import APIRouter, Depends
from sqlmodel import Session

from core.db import get_session 
from core.tokens import oauth2_bearer
from models import ProjectModel
from repository import ProjectRepository

# Project Router;
project_router = APIRouter(
	prefix="/projects",
	tags=["projects"]
)

# Get User by Params;
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
