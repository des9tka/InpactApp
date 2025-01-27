from sqlmodel import Session, select, or_
from sqlalchemy.sql.expression import func


# Create User;
def createUserService(session: Session, user_data, hashed_password):
    from models.UserModels import UserModel
    user = UserModel(
        email=user_data.email,
        password=hashed_password,
        username=user_data.username,
        name=user_data.name,
        surname=user_data.surname
    )

    session.add(user)
    session.commit()
    session.refresh(user)
    return user

# Get User By Params;
def getUserByService(session: Session, id=None, email=None, username=None):
    from models.UserModels import UserModel

    if not session: return

    query = select(UserModel).where(
        or_(
            UserModel.id == id if id else False,
            func.lower(UserModel.email).like(f"%{email.lower()}%") if email else False,
            func.lower(UserModel.username).like(f"%{username.lower()}%") if username else False
        )
    )
    return session.exec(query).all()
	
# Get All Users;
def getAllUsers(session):
    from models.UserModels import UserModel
    return session.exec(select(UserModel)).all()