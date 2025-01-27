from sqlmodel import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from starlette.concurrency import run_in_threadpool
from typing import List

from models import ProjectModel
from core.tokens import validate_token


class ProjectRepository:
	# Create Project;
	@classmethod
	async def create_project(
        cls,
        session,
		token,
		project_data
    ) -> ProjectModel:
		user_id = await validate_token(token)
		project_data.founder_id = user_id

		return await ProjectModel.create_project(
			session=session,
			project_data=project_data
		)
