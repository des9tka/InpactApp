from sqlmodel import Session, select, or_
from datetime import date
from fastapi import HTTPException


class ProjectServicesStore:
    # Create a new Project
    @classmethod
    def createProjectService(cls, session: Session, project_data):
        from models import ProjectModel
        
        # Create a new project instance and add it to the session
        project = ProjectModel(
            name=project_data.name,
            founder_id=project_data.founder_id     
        )
        
        session.add(project)  # Add the new project to the session
        session.commit()  # Commit the changes to the database
        session.refresh(project)  # Refresh the project object with the updated data
        return project
    
    # Get a Project by ID
    @classmethod 
    def getProjectById(cls, session: Session, project_id):
        from models import ProjectModel

        if not session:
            raise HTTPException(detail="No session provided.", status_code=400 )
        
        # Query for a project with the given ID
        query = select(ProjectModel).where(
            or_(
                ProjectModel.id == project_id if project_id else False,
            )
        )
    
        return session.exec(query).first()  # Return the first result from the query

    # Delete a Project by ID
    @classmethod
    def deleteProjectService(cls, session: Session, project_id):
        from models import ProjectModel

        # Get the project by ID
        project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
        
        session.delete(project)  # Delete the project from the session
        session.commit()  # Commit the changes to the database
        return {"detail": f"Project with id {project_id} has been deleted."}
    
    # Update Project details
    @classmethod
    def updateProjectService(cls, session: Session, project_id, project_data):
        from models import ProjectModel

        # Get the project by ID
        project = ProjectModel.get_project_by_id(session=session, project_id=project_id)

        # Update project details if provided
        if project_data:
            project.name = project_data.name
            project.updated_at = date.today()  # Set the update timestamp
            session.commit()  # Commit the changes to the database
            session.refresh(project)  # Refresh the project object with the updated data
            return project
