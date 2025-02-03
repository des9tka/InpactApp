from sqlmodel import SQLModel, Field, Session, Relationship
from datetime import date
from typing import Optional, Annotated, List, TYPE_CHECKING

from services import ProjectServicesStore
from enums.model_validators import ProjectValidator
from models.RelationsModels import UserProjectModel

# To avoid circular imports, TYPE_CHECKING is used
if TYPE_CHECKING:
    from models import UserModel

class ProjectModel(SQLModel, table=True):
    __tablename__ = "project"
    
    # The primary key for the project
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # The name of the project with a maximum length of 50 characters
    name: Annotated[str, (2, 50)] = Field(..., max_length=50, min_length=2)
    
    # The ID of the founder (foreign key referencing the User model)
    founder_id: int = Field(foreign_key="user.id")
    
    # The date when the project was created, defaulting to today's date
    created_at: Optional[date] = Field(default_factory=date.today)
    
    # The date when the project was last updated, which can be set to None
    updated_at: Optional[date] = Field(default=None)

    # Relationship to the UserModel, indicating that each project can have many users
    users: List["UserModel"] = Relationship(back_populates="projects", link_model=UserProjectModel)

    @classmethod
    def validate_project_data(cls, values):
        # Custom validation logic for the entire user object
        name = values.name if hasattr(values, 'name') else None

        # Use UserValidator to validate individual fields
        if name:
            ProjectValidator.validate_project_name(name)
        return values

    class Config:
        # This ensures that attributes are mapped from the response model
        from_attributes = True

    # Class method to create a new project
    @classmethod
    def create_project(cls, session: Session, project_data):
        cls.validate_project_data(project_data)
        return ProjectServicesStore.createProjectService(
            session=session,
            project_data=project_data,
        )
    
    # Class method to retrieve a project by its ID
    @classmethod
    def get_project_by_id(cls, session: Session, project_id):
        return ProjectServicesStore.getProjectById(session=session, project_id=project_id)
    
    # Class method to delete a project by its ID
    @classmethod
    def delete_project(cls, session: Session, project_id):
        return ProjectServicesStore.deleteProjectService(session=session, project_id=project_id)
    
    # Class method to update an existing project
    @classmethod
    def update_project(cls, session: Session, project_id, project_data):
        return ProjectServicesStore.updateProjectService(session=session, project_id=project_id, project_data=project_data)
