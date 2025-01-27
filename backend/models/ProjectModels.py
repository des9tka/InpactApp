from sqlmodel import SQLModel, Field, Session
from datetime import date
from typing import Optional, Annotated

from services import ProjectServicesStore

class ProjectModel(SQLModel, table=True):
    __tablename__ = "project"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Annotated[str, (0, 50)] = Field(..., max_length=50)
    founder_id: int = Field(..., foreign_key="user.id")
    created_at: Optional[date] = Field(default_factory=date.today)
    updated_at: Optional[date] = Field(default=None)


    @classmethod
    async def create_service(cls, session: Session, project_data):
        return await ProjectServicesStore.createProjectService(
            session=session,
            project_data=project_data,
        )