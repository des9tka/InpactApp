from sqlmodel import Session
from fastapi import HTTPException
from passlib.hash import bcrypt
from starlette.concurrency import run_in_threadpool
from typing import List

from models import ProjectModel
from core.tokens import validate_token
from models import UserProjectModel, ProjectModel


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
	
	@classmethod
	async def add_user_to_project(
		cls, 
		session, 
		token, 
		project_id, 
		user_id
	):
		user_id = await validate_token(token=token)
		project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
		if not project:
			raise HTTPException(status_code=404, detail="Project not found.")

		if project.founder_id != user_id:
			raise HTTPException(status_code=400, detail="You are not the founder of this project.")
		
		user_project = UserProjectModel(user_id=user_id, project_id=project_id)

		session.add(user_project)
		session.commit()	
		session.refresh(user_project)
		return {"detail": "User added to project."}