from sqlmodel import SQLModel, Field, Session, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import date

from services import UserServicesStore
from models.RelationsModels import UserProjectModel

# To avoid circular imports, TYPE_CHECKING is used
if TYPE_CHECKING:
    from models import ProjectModel

class UserModel(SQLModel, table=True):
    __tablename__ = "user"

    # Primary key for the user (auto-generated)
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Unique email for the user, with a minimum length of 2 characters
    email: str = Field(..., min_length=2, unique=True)
    
    # Password field with a minimum length of 4 and max length of 25
    # This will be excluded from the output
    password: str = Field(..., min_length=4, max_length=25, exclude=True)
    
    # Unique username for the user, with a minimum of 2 and maximum of 50 characters
    username: str = Field(..., min_length=2, max_length=50, unique=True)
    
    # Optional name and surname fields
    name: Optional[str] = Field(default=None, min_length=2, max_length=50)
    surname: Optional[str] = Field(default=None, min_length=2, max_length=50)
    
    # Flag indicating whether the user is active or not
    is_active: Optional[bool] = Field(default=False)
    
    # Date of user creation, defaulting to today's date
    created_at: Optional[date] = Field(default_factory=date.today)
    
    # Date when the user was last updated
    updated_at: Optional[date] = Field(default=None)

    # Many-to-many relationship with projects (via the UserProjectModel)
    projects: List["ProjectModel"] = Relationship(back_populates="users", link_model=UserProjectModel)

    class Config:
        # This ensures that attributes are mapped from the response model
        from_attributes = True

    # Class method to create a new user with hashed password
    @classmethod
    def create_user(cls, session: Session, user_data, hashed_password):
        return UserServicesStore.createUserService(
            session=session,
            user_data=user_data,
            hashed_password=hashed_password
        )

    # Class method to retrieve a user based on different attributes (id, email, username)
    @classmethod
    def get_user_by(cls, session: Session, 
        id: Optional[int] = None, 
        email: Optional[str] = None, 
        username: Optional[str] = None
    ):
        return UserServicesStore.getUserByService(
            session, 
            id,
            email,
            username
        )
    
    # Class method to retrieve all users from the database
    @classmethod
    def get_all_users(cls, session: Session):
        return UserServicesStore.getAllUsersService(
            session
        )
    
    # Class method to update an existing user's details
    @classmethod
    def update_user(cls, session: Session, user_id, user_data):
        return UserServicesStore.updateUserService(
            session=session,
            user_data=user_data,
            user_id=user_id
        )
