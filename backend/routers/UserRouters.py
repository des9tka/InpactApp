from fastapi import APIRouter

user_router = APIRouter(
	prefix="/user",
	tags=["user"]
)


@user_router.get("/users")
async def index():
	return {"message": "Hello World"}