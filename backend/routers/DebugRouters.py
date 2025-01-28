import os
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from dotenv import load_dotenv

from core.db import get_session 
from core.redis.redis_services import get_all_info_from_redis
from models import UserModel, UserProjectModel
from enums import AdminKeyEnum

load_dotenv()

debug_router = APIRouter(
	prefix="/debug",
	tags=["debug"]
)

@debug_router.get("/get_redis_data")
async def get_redis_data():
	return await get_all_info_from_redis()

@debug_router.post("/delete_users/{user_id}")
async def delete_users(
    user_id: int,
    session: Session = Depends(get_session),
    admin_key: AdminKeyEnum = None
):
    if not os.getenv("ADMIN_KEY"):
        raise HTTPException(status_code=500, detail="ADMIN_KEY is not set.")

    if admin_key.admin_key != os.getenv("ADMIN_KEY"):
        raise HTTPException(status_code=403, detail="You are not an admin.")

    user = session.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user_projects_deleted = session.query(UserProjectModel).filter(
        UserProjectModel.user_id == user_id
    ).delete()
    session.commit()

    session.delete(user)
    session.commit()

    return {
        "detail": f"User with id {user_id} has been deleted.",
        "user_projects_deleted": user_projects_deleted
    }

