from sqlmodel import SQLModel, Field

class UserProjectModel(SQLModel, table=True):
    __tablename__ = "user_project"
    
    # Foreign key to the 'user' table
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    
    # Foreign key to the 'project' table
    project_id: int = Field(foreign_key="project.id", primary_key=True)
