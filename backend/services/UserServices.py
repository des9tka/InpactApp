from sqlmodel import Session, select
from sqlalchemy import or_


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
            UserModel.id == id,
            UserModel.email == email,
            UserModel.username == username
        )
    )
    return session.exec(query).first()
	