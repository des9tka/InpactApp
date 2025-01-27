from sqlmodel import Session


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
		