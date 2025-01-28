from sqlmodel import SQLModel, Field


class UserProjectModel(SQLModel, table=True):
    __tablename__ = "user_project"
    
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    project_id: int = Field(foreign_key="project.id", primary_key=True)
