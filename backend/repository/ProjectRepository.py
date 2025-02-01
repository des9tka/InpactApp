from fastapi import HTTPException
from sqlmodel import select

from core.tokens import validate_token, create_invite_token, is_allowed_request
from models import UserProjectModel, ProjectModel, UserModel
from services import send_invite_project_link


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

		query = select(ProjectModel).where(ProjectModel.founder_id == user_id)

		projects = session.exec(query).all()

		if len(projects) == 3:
			raise HTTPException(status_code=400, detail="For one founder only 3 projects.")

		project_data.founder_id = user_id

		project = ProjectModel.create_project(
			session=session,
			project_data=project_data
		)

		user_project = UserProjectModel(user_id=user_id, project_id=project.id)

		session.add(user_project)
		session.commit()  
		session.refresh(project)

		return project

	@classmethod
	async def get_project_by_id(
		cls,
		session,
		token,
		project_id,
	):
		await validate_token(token)
		return ProjectModel.get_project_by_id(session=session, project_id=project_id)
	
	@classmethod
	async def add_user_to_project(
		cls, 
		session, 
		token,
		project_id, 
		user_id,
		background_tasks
	):
		if not project_id or not user_id:
			raise HTTPException(status_code=400, detail="Missing project or user ids")
		
		user = UserModel.get_user_by(session=session, id=user_id)
		if not user:
			raise HTTPException(status_code=404, detail="User not found")

		project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
		if not project:
			raise HTTPException(status_code=404, detail="Project not found")
		
		founder_id = await validate_token(token=token)
		if project.founder_id != founder_id:
			raise HTTPException(status_code=400, detail="You are not the founder of this project")

		query = select(UserProjectModel).where(ProjectModel.id == project_id)
		projects_with_user = session.exec(query).all()

		if len(projects_with_user) == 10:
			raise HTTPException(status_code=400, detail="Project is full of staff. Maximum 10 users") 
		
		existing_user_project = session.query(UserProjectModel).filter(
			UserProjectModel.user_id == user_id,
			UserProjectModel.project_id == project_id
		).first()

		if existing_user_project:
			raise HTTPException(status_code=400, detail="User is already part of this project")

		if not await is_allowed_request(user_id=user.id, token_type="invite", project_id=project_id):
			raise HTTPException(
            	status_code=429,
                detail=f"Invite link already sent to {user.email}"
            )

		invite_project_token = await create_invite_token(project_id=project_id, user_id=user_id)

		return invite_project_token

		# await send_invite_project_link(invite_project_token=invite_project_token, background_tasks=background_tasks, inviter_project=project.name, user_email=user.email)
		# return {"detail": f"invite link was sended to {user.email}."}

		# user_project = UserProjectModel(user_id=user_id, project_id=project_id)

		# session.add(user_project)
		# session.commit()    
		# session.refresh(user_project)
		# return {"detail": "User added to project."}

	@classmethod
	async def delete_user_from_project(
		cls,
		session,
		token,
		project_id,
		projectUser_id
	):
		user_id = await validate_token(token=token)
		project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
		
		if not project:
			raise HTTPException(detail="Project not found.", status_code=404)
		
		if project.founder_id != user_id:
			raise HTTPException(detail="You are not the founder of this project.", status_code=400)

		if user_id == projectUser_id:
			raise HTTPException(detail="You cannot remove yourself from the project.", status_code=400)
		
		user_project = session.query(UserProjectModel).filter(
			UserProjectModel.user_id == projectUser_id,
			UserProjectModel.project_id == project_id
		).first()

		if not user_project:
			raise HTTPException(detail="User is not part of the project.", status_code=404)
		
		session.delete(user_project)
		session.commit()
		return {"detail": f"User {projectUser_id} removed from project."}
	
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
			raise HTTPException(detail="Project or user was not found.", status_code=404)
		
		users_in_project = session.query(UserModel).join(
			UserProjectModel, UserProjectModel.user_id == UserModel.id
		).filter(UserProjectModel.project_id == project_id).all()

		if not users_in_project:
			raise HTTPException(detail="No users found for this project.", status_code=404)
		
		return users_in_project
	
	@classmethod
	async def delete_project(
		cls,
		session,
		token,
		project_id
	):
		user_id = await validate_token(token=token)
		project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
		
		if not project:
			raise HTTPException(status_code=404, detail="Project not found.")
		
		if project.founder_id != user_id:
			raise HTTPException(status_code=400, detail="You are not the founder of this project.")
		
		return ProjectModel.delete_project(session=session, project_id=project_id)
	
	@classmethod
	async def update_project(
		cls,
		session,
		token,
		project_id,
		project_data
	):
		user_id = await validate_token(token=token)
		project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
		
		if not project:
			raise HTTPException(status_code=404, detail="Project not found.")
		
		if project.founder_id != user_id:
			raise HTTPException(status_code=400, detail="You are not the founder of this project.")
		
		return ProjectModel.update_project(session=session, project_id=project_id, project_data=project_data)
