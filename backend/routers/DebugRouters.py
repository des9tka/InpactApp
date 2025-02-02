import os
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from dotenv import load_dotenv

from core.db import get_session 
from core.redis.redis_services import get_all_info_from_redis, clear_redis
from models import UserModel, UserProjectModel
from enums import AdminKeyEnum

# Load environment variables from .env file
load_dotenv()

# Debug router for admin-level operations
debug_router = APIRouter(
	prefix="/debug",
	tags=["debug"]
)

# Get all data stored in Redis
@debug_router.get("/get_redis_data")
async def get_redis_data():
	return await get_all_info_from_redis()

# Delete all data from Redis
@debug_router.get("/delete_all_redis")
async def delete_all_redis():
    await clear_redis()
    return {"detail": "Redis has been cleared."}

# Admin endpoint to delete a user and their associated projects
@debug_router.post("/delete_users/{user_id}")
async def delete_users(
    user_id: int,
    session: Session = Depends(get_session),
    admin_key: AdminKeyEnum = None
):
    # Check if ADMIN_KEY is set in the environment
    if not os.getenv("ADMIN_KEY"):
        raise HTTPException(status_code=500, detail="ADMIN_KEY is not set.")

    # Validate admin key
    if admin_key.admin_key != os.getenv("ADMIN_KEY"):
        raise HTTPException(status_code=403, detail="You are not an admin.")

    # Fetch the user from the database
    user = session.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Delete the user's associated projects
    user_projects_deleted = session.query(UserProjectModel).filter(
        UserProjectModel.user_id == user_id
    ).delete()
    session.commit()

    # Delete the user
    session.delete(user)
    session.commit()

    # Return success message and count of deleted projects
    return {
        "detail": f"User with id {user_id} has been deleted.",
        "user_projects_deleted": user_projects_deleted
    }
