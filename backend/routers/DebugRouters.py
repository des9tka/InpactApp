from fastapi import APIRouter

from core.redis.redis_services import get_all_info_from_redis

debug_router = APIRouter(
	prefix="/debug",
	tags=["debug"]
)

@debug_router.get("/get_redis_data", tags=["redis_data"])
async def get_redis_data():
	return await get_all_info_from_redis()