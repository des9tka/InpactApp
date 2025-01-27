from sqlmodel import Session, select, or_
from sqlalchemy.sql.expression import func


class ProjectServicesStore:
    # Create User;
    @classmethod
    async def createProjectService(cls, session: Session, project_data):
        from models import ProjectModel
        
        project = ProjectModel(
			name=project_data.name,
			founder_id=project_data.founder_id     
		)
        
        session.add(project)
        session.commit()
        session.refresh(project)
        return project
		