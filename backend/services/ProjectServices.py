from sqlmodel import Session, select, or_
from datetime import date


class ProjectServicesStore:
    # Create Project;
    @classmethod
    def createProjectService(cls, session: Session, project_data):
        from models import ProjectModel
        
        project = ProjectModel(
			name=project_data.name,
			founder_id=project_data.founder_id     
		)
        
        session.add(project)
        session.commit()
        session.refresh(project)
        return project
    
    # Get Project By Id;
    @classmethod 
    def getProjectById(cls, session: Session, project_id):
        from models import ProjectModel
        
        query = select(ProjectModel).where(
            or_(
                ProjectModel.id == project_id if project_id else False,
            )
        )
    
        return session.exec(query).first()

    # Delete Project;
    @classmethod
    def deleteProjectService(cls, session: Session, project_id):
        from models import ProjectModel

        project = ProjectModel.get_project_by_id(session=session, project_id=project_id)
        session.delete(project)
        session.commit()
        return {"detail": f"Project with id {project_id} has been deleted."}
    
    # Update Project;
    @classmethod
    def updateProjectService(cls, session: Session, project_id, project_data):
        from models import ProjectModel

        project = ProjectModel.get_project_by_id(session=session, project_id=project_id)

        if project_data:
            project.name = project_data.name
            project.updated_at = date.today()
            session.commit()
            session.refresh(project)
            return project