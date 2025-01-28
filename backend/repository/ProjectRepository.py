from fastapi import HTTPException

from core.tokens import validate_token
from models import UserProjectModel, ProjectModel, UserModel


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

		return ProjectModel.create_project(
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
		if not project_id or not user_id:
			raise HTTPException(status_code=400, detail="Missing project or user ids.")
		
		founder_id = await validate_token(token=token)
		user = UserModel.get_user_by(session=session, id=user_id)
		
		if not user:
			raise HTTPException(status_code=404, detail="User not found.")

		project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
		if not project:
			raise HTTPException(status_code=404, detail="Project not found.")
		
		if project.founder_id != founder_id:
			raise HTTPException(status_code=400, detail="You are not the founder of this project.")
		
		# Проверяем, существует ли уже связь между user_id и project_id
		existing_user_project = session.query(UserProjectModel).filter(
			UserProjectModel.user_id == user_id,
			UserProjectModel.project_id == project_id
		).first()

		if existing_user_project:
			raise HTTPException(status_code=400, detail="User is already part of the project.")
		
		# Если записи нет, добавляем пользователя в проект
		user_project = UserProjectModel(user_id=user_id, project_id=project_id)

		session.add(user_project)
		session.commit()    
		session.refresh(user_project)
		return {"detail": "User added to project."}
	
	@classmethod
	async def get_users_from_project(
		cls,
		session,
		token,
		project_id
	):
		user_id = await validate_token(token=token)
		print(user_id)
		user_project = UserProjectModel(user_id=user_id, project_id=project_id)

		if not user_project:
			raise HTTPException(status_code=404, detail="Project or user was not found.")
		
		users_in_project = session.query(UserModel).join(
			UserProjectModel, UserProjectModel.user_id == UserModel.id
		).filter(UserProjectModel.project_id == project_id).all()

		if not users_in_project:
			raise HTTPException(status_code=404, detail="No users found for this project.")
		
		return users_in_project