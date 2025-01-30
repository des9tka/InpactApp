from sqlmodel import SQLModel, Field, Session, Relationship
from datetime import date
from typing import Optional, Annotated, List, TYPE_CHECKING

from services import ProjectServicesStore
from models.RelationsModels import UserProjectModel

if TYPE_CHECKING:
    from models import UserModel

class ProjectModel(SQLModel, table=True):
    __tablename__ = "project"
    
    id: Optional[int] = Field(default=None, primary_key=True)  
    name: Annotated[str, (0, 50)] = Field(..., max_length=50)
    founder_id: int = Field(foreign_key="user.id")
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)

    users: List["UserModel"] = Relationship(back_populates="projects", link_model=UserProjectModel)

    class Config:
        from_attributes = True

    @classmethod
    def create_project(cls, session: Session, project_data):
        return ProjectServicesStore.createProjectService(
            session=session,
            project_data=project_data,
        )
    
    @classmethod
    def get_project_by_id(cls, session: Session, project_id):
        return ProjectServicesStore.getProjectById(session=session, project_id=project_id)
    
    @classmethod
    def delete_project(cls, session: Session, project_id):
        return ProjectServicesStore.deleteProjectService(session=session, project_id=project_id)
    
    @classmethod
    def update_project(cls, session: Session, project_id, project_data):
        return ProjectServicesStore.updateProjectService(session=session, project_id=project_id, project_data=project_data)
