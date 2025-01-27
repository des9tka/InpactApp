import os
from datetime import timezone, datetime
from jose import jwt, JWTError
from dotenv import load_dotenv
from jose.exceptions import ExpiredSignatureError
from typing import Optional

from core.redis.db import redis_retry, RedisConnection


load_dotenv()

# V.2 -> Tokens Valid Store Check; 
def keys(user_id, access: Optional[bool] = False, refresh: Optional[bool] = False) -> Optional[str]:
	if access: return f"user:{user_id}:access_token"
	elif refresh: return f"user:{user_id}:refresh_token"
	else: return None

@redis_retry
async def store_user_token(
	user_id: int, 
	access_expiration: Optional[int] = None, 
	refresh_expiration: Optional[int] = None, 
	access_token: Optional[str] = None, 
	refresh_token: Optional[str] = None
):
	redis = RedisConnection.get_instance()

	access_key = keys(user_id=user_id, access=True)
	refresh_key = keys(user_id=user_id, refresh=True)

	if access_token and access_expiration:
		redis.delete(access_key)
		redis.set(access_key, access_token, ex=access_expiration)	

	if refresh_token and refresh_expiration:
		redis.delete(refresh_key)
		redis.set(refresh_key, refresh_token, ex=refresh_expiration)

@redis_retry
async def is_in_store(user_id: int, access_token: Optional[str] = None, refresh_token: Optional[str] = None, double_check: bool = False):
	redis = RedisConnection.get_instance()
	
	access_key = keys(user_id=user_id, access=True)
	refresh_key = keys(user_id=user_id, refresh=True)

	if double_check and (not access_token or not refresh_token):
		return None, None
     
	if access_token:
		print(redis.exists(access_key))
		if redis.get(access_key) != access_token:
			if double_check:
				access_token = None
			else: return None

	if refresh_token:
		print(redis.exists(refresh_key))
		if redis.get(refresh_key) != refresh_token:
			if double_check:
				refresh_token = None
			else: return None
	
	return access_token, refresh_token

# Dev Get all Info from Redis (for debug);
@redis_retry
async def get_all_info_from_redis():
	state = []
	redis = RedisConnection.get_instance()
	cursor, keys = redis.scan(cursor=0)
	for key in keys:
		value = redis.get(key)
		state.append(f"Key: {key}, Value: {value}")
	return state



# V.1 -> BlackListing Tokens;
# @redis_retry
# async def cleanup_blacklist():
#     redis = RedisConnection.get_instance()
#     for key in redis.scan_iter("*"):
#         if await is_token_blacklisted(key):
#             try:
#                 payload = jwt.decode(key, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
#                 exp = payload.get("exp", 0)
#                 if datetime.now(timezone.utc).timestamp() > exp:
#                     redis.delete(key)
#             except (ExpiredSignatureError, JWTError):
#                 redis.delete(key)

# @redis_retry
# async def cleanup_user_tokens(user_id: int):
#     redis = RedisConnection.get_instance()
#     tokens = await get_user_tokens(user_id)
#     valid_tokens = set()
    
#     for token in tokens:
#         try:
#             payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
#             valid_tokens.add(token)
#         except (ExpiredSignatureError, JWTError):
#             continue
    
#     if valid_tokens:
#         user_key = f"user:{user_id}:tokens"
#         redis.delete(user_key)
#         redis.sadd(user_key, *valid_tokens)

# @redis_retry
# async def add_token_to_blacklist(token: str, expiration: int):
#     redis = RedisConnection.get_instance()
#     redis.set(f"blacklist:{token}", "1", ex=expiration)

# @redis_retry
# async def is_token_blacklisted(token: str) -> bool:
#     redis = RedisConnection.get_instance()
#     return redis.exists(f"blacklist:{token}") > 0

# @redis_retry
# async def store_user_token(user_id: int, tokens: List[str], expiration: int):
#     redis = RedisConnection.get_instance()
#     user_key = f"user:{user_id}:tokens"
    
#     redis.sadd(user_key, tokens[0])
#     redis.expire(user_key, expiration)
    
#     reference_token = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
#     reference_exp = reference_token.get("exp", 0)
    
#     existing_tokens = await get_user_tokens(user_id)
#     for old_token in existing_tokens:
#         if old_token not in tokens:
#             try:
#                 payload = jwt.decode(old_token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
#                 token_type = payload.get("type")
#                 exp = payload.get("exp", 0)
#                 remaining_ttl = max(0, int(exp - datetime.now(timezone.utc).timestamp()))
#                 print(token, f"reference_exp - {reference_exp}", f"exp - {exp}", reference_exp - exp)
#                 if reference_exp - exp < 1000 and token_type == TokenEnum.ACCESS:
#                     continue
#                 elif remaining_ttl > 0:
#                     await add_token_to_blacklist(old_token, remaining_ttl)
#                 else:
#                     redis.srem(user_key, old_token)
#             except (ExpiredSignatureError, JWTError):
#                 redis.srem(user_key, old_token)

    
#     user_key = f"user:{user_id}:tokens"
#     redis.sadd(user_key, token)
#     redis.expire(user_key, expiration)

# @redis_retry
# async def get_user_tokens(user_id: int):
#     """Получает все токены пользователя"""
#     redis = RedisConnection.get_instance()
#     user_key = f"user:{user_id}:tokens"
#     return redis.smembers(user_key)