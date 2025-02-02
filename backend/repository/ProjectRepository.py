import os
from fastapi import HTTPException
from sqlmodel import select
from dotenv import load_dotenv
from sqlalchemy import and_

from core.tokens import validate_token, create_invite_token, is_allowed_request, get_user_by_token
from models import UserProjectModel, ProjectModel, UserModel, ImpactModel
from services import send_invite_project_link

load_dotenv()

class ProjectRepository:
    # Create a new project
    @classmethod
    async def create_project(
        cls,
        session,
        token,
        project_data
    ) -> ProjectModel:
        # Validate the provided token and get the user ID
        user_id = await validate_token(token)

        # Check if the user already has 3 projects
        query = select(ProjectModel).where(ProjectModel.founder_id == user_id)
        projects = session.exec(query).all()

        if len(projects) == 3:
            raise HTTPException(status_code=400, detail="For one founder only 3 projects.")

        # Set the founder ID and create the project
        project_data.founder_id = user_id
        project = ProjectModel.create_project(session=session, project_data=project_data)

        # Add the user to the project as the founder
        user_project = UserProjectModel(user_id=user_id, project_id=project.id)
        session.add(user_project)
        session.commit()
        session.refresh(project)

        return project

    # Get all projects owned by the user
    @classmethod
    async def get_user_projects(cls, session, token): 
        user_id = await validate_token(token)
        query = select(ProjectModel).where(ProjectModel.founder_id == user_id)
        projects = session.exec(query).all()
        return projects

    # Get all projects that the user is invited to
    @classmethod
    async def get_invited_projects(
        cls,
        session,
        token
    ):
        user_id = await validate_token(token)

        query = select(ProjectModel).join(UserProjectModel).where(
            and_(
                UserProjectModel.user_id == user_id,
                ProjectModel.founder_id != user_id  
            )
        )

        projects = session.exec(query).all()
        
        return projects

    # Get a project by its ID
    @classmethod
    async def get_project_by_id(
        cls,
        session,
        token,
        project_id,
    ):
        await validate_token(token)
        return ProjectModel.get_project_by_id(session=session, project_id=project_id)

    # Add a user to a project
    @classmethod
    async def add_user_to_project(
        cls, 
        session, 
        token,
        project_id, 
        user_id,
        background_tasks
    ):
        # Ensure both project and user IDs are provided
        if not project_id or not user_id:
            raise HTTPException(status_code=400, detail="Missing project or user ids")
        
        # Verify user and project existence
        user = UserModel.get_user_by(session=session, id=user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Check if the user is the project founder
        founder_id = await validate_token(token=token)
        if project.founder_id != founder_id:
            raise HTTPException(status_code=400, detail="You are not the founder of this project")

        # Ensure the project has not reached its user limit
        query = select(UserProjectModel).where(ProjectModel.id == project_id)
        projects_with_user = session.exec(query).all()

        if len(projects_with_user) == 10:
            raise HTTPException(status_code=400, detail="Project is full of staff. Maximum 10 users")

        # Check if the user is already part of the project
        existing_user_project = session.query(UserProjectModel).filter(
            UserProjectModel.user_id == user_id,
            UserProjectModel.project_id == project_id
        ).first()

        if existing_user_project:
            raise HTTPException(status_code=400, detail="User is already part of this project")

        # Check if an invite link has already been sent
        if not await is_allowed_request(user_id=user.id, token_type="invite", project_id=project_id):
            raise HTTPException(
                status_code=429,
                detail=f"Invite link already sent to {user.email}"
            )

        # Generate an invite token and send the invite link
        invite_project_token = await create_invite_token(project_id=project.id, user_id=user_id)
        await send_invite_project_link(
            invite_project_token=invite_project_token, 
            background_tasks=background_tasks, 
            inviter_project=project.name, 
            user_email=user.email
        )

        return {"detail": f"Invite link was sent to {user.email}."}

    # Join a team by using an invite token
    @classmethod
    async def join_team(cls, session, invite_token):
        user_id, project_id, token_type = await get_user_by_token(token=invite_token, project_id=True)

        # Ensure the user is not already in the project
        existing_user_project = session.query(UserProjectModel).filter_by(
            user_id=user_id, project_id=project_id
        ).first()

        if existing_user_project:
            raise HTTPException(status_code=400, detail="User is already in the project.")

        # Validate the token type and user/project IDs
        if token_type != "invite":
            raise HTTPException(detail="Invalid token type.", status_code=400)

        if not user_id or not project_id:
            raise HTTPException(detail="Missing user or project id.", status_code=400)

        # Add the user to the project
        user_project = UserProjectModel(user_id=user_id, project_id=project_id)
        session.add(user_project)
        session.commit()
        session.refresh(user_project)
        return {"detail": "User added to project."}


    # Remove a user from a project
    @classmethod
    async def delete_user_from_project(
        cls,
        session,
        token,
        project_id,
        projectUser_id
    ):
        # Ensure the user is the project founder
        user_id = await validate_token(token=token)
        project = ProjectModel.get_project_by_id(session=session, project_id=project_id)

        # Get project relation
        query = select(UserProjectModel).where(ProjectModel.id == project_id)
        user_project = session.exec(query).first()
        
        if not project:
            raise HTTPException(detail="Project not found.", status_code=404)
        
        if project.founder_id != user_id and user_project.user_id != user_id:
            raise HTTPException(detail="You are not the founder/user of this project to remove users.", status_code=400)

        # Ensure the user is not removing themselves
        if user_id == projectUser_id and project.founder_id == user_id:
            raise HTTPException(detail="You cannot remove yourself from the project.", status_code=400)

        # Ensure the user is part of the project
        user_project = session.query(UserProjectModel).filter(
            UserProjectModel.user_id == projectUser_id,
            UserProjectModel.project_id == project_id
        ).first()

        if not user_project:
            raise HTTPException(detail="User is not part of the project.", status_code=404)
        
        # Remove the user from the project
        session.delete(user_project)
        session.commit()
        return {"detail": f"User {projectUser_id} removed from project."}

    # Get all users from a project
    @classmethod
    async def get_users_from_project(
        cls,
        session,
        token,
        project_id
    ):
        user_id = await validate_token(token=token)

        user_project = UserProjectModel(user_id=user_id, project_id=project_id)

        if not user_project:
            raise HTTPException(detail="Project or user was not found.", status_code=404)
        
        # Retrieve all users in the project
        users_in_project = session.query(UserModel).join(
            UserProjectModel, UserProjectModel.user_id == UserModel.id
        ).filter(UserProjectModel.project_id == project_id).all()

        if not users_in_project:
            raise HTTPException(detail="No users found for this project.", status_code=404)
        
        return users_in_project

    # Delete a project
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
        
        # Ensure the user is the project founder
        if project.founder_id != user_id:
            raise HTTPException(status_code=400, detail="You are not the founder of this project.")

        # Remove all users from the project
        users_in_project = session.query(UserProjectModel).filter_by(project_id=project_id).all()
        for user_project in users_in_project:
            session.delete(user_project)
            session.commit()

        # Remove all impacts from the project
        impacts_in_project = session.query(ImpactModel).filter_by(project_id=project_id).all()
        for impact in impacts_in_project:
            session.delete(impact)
            session.commit()
        
        # Delete the project
        return ProjectModel.delete_project(session=session, project_id=project_id)

    # Update project details
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
        
        # Ensure the user is the project founder
        if project.founder_id != user_id:
            raise HTTPException(status_code=400, detail="You are not the founder of this project.")
        
        # Update the project
        return ProjectModel.update_project(session=session, project_id=project_id, project_data=project_data)
