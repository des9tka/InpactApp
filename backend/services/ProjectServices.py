from sqlmodel import Session, select, or_


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

