import os
from datetime import timezone, datetime
from jose import jwt, JWTError
from dotenv import load_dotenv
from jose.exceptions import ExpiredSignatureError
from typing import Optional

from core.redis.db import redis_retry, RedisConnection


load_dotenv()

# V.2 -> Tokens Valid Store Check; 
def keys(
	user_id, 
	access: Optional[bool] = False, 
	refresh: Optional[bool] = False,
	activate: Optional[bool] = False, 
	recovery: Optional[bool] = False
) -> Optional[str]:
	if access: return f"user:{user_id}:access_token"
	elif refresh: return f"user:{user_id}:refresh_token"
	elif activate: return f"user:{user_id}:activate_token"
	elif recovery: return f"user:{user_id}:recovery_token"
	else: return None

@redis_retry
async def store_user_token(
	user_id: int, 
	access_expiration: Optional[int] = None, 
	refresh_expiration: Optional[int] = None, 
	activate_expiration: Optional[int] = None, 
	recovery_expiration: Optional[int] = None, 
	access_token: Optional[str] = None, 
	refresh_token: Optional[str] = None,
	activate_token: Optional[str] = None, 
	recovery_token: Optional[str] = None
):
	redis = RedisConnection.get_instance()

	access_key = keys(user_id=user_id, access=True)
	refresh_key = keys(user_id=user_id, refresh=True)
	activate_key = keys(user_id=user_id, activate=True)
	recovery_key = keys(user_id=user_id, recovery=True)

	if access_token and access_expiration:
		redis.delete(access_key)
		redis.set(access_key, access_token, ex=access_expiration)	

	if refresh_token and refresh_expiration:
		redis.delete(refresh_key)
		redis.set(refresh_key, refresh_token, ex=refresh_expiration)

	if activate_token and activate_expiration:
		redis.delete(activate_key)
		redis.set(activate_key, activate_token, ex=activate_expiration)

	if recovery_token and recovery_expiration:
		redis.delete(recovery_key)
		redis.set(recovery_key, recovery_token, ex=recovery_expiration)

@redis_retry
async def is_in_store(
	user_id: int, 
	access_token: Optional[str] = None, 
	refresh_token: Optional[str] = None,
	activate_token: Optional[str] = None, 
	recovery_token: Optional[str] = None
	):
	redis = RedisConnection.get_instance()
	     
	if access_token:
		access_key = keys(user_id=user_id, access=True)
		if redis.get(access_key) != access_token:
			return None

	elif refresh_token:
		refresh_key = keys(user_id=user_id, refresh=True)
		if redis.get(refresh_key) != refresh_token:
			return None

	elif activate_token:
		activate_key = keys(user_id=user_id, activate=True)
		if redis.get(activate_key) != activate_token:
			return None

	elif recovery_token:
		recovery_key = keys(user_id=user_id, recovery=True)
		print(redis.get(recovery_key))
		if redis.get(recovery_key) != recovery_token:
			return None
	else: return None
	
	return True

@redis_retry
async def remove_tokens(
	user_id: int,
	access_token: Optional[str] = None, 
	refresh_token: Optional[str] = None,
	activate_token: Optional[str] = None, 
	recovery_token: Optional[str] = None
):
	redis = RedisConnection.get_instance()

	access_key = keys(user_id=user_id, access=True)
	refresh_key = keys(user_id=user_id, refresh=True)
	activate_key = keys(user_id=user_id, activate=True)
	recovery_key = keys(user_id=user_id, recovery=True)
    
	if access_token:
		redis.delete(access_key)
	elif refresh_token:
		redis.delete(refresh_key)
	elif activate_token:
		redis.delete(activate_key)
	elif recovery_token:
		redis.delete(recovery_key)

@redis_retry
async def get_token_by_user_id(user_id: int, token_type: str):
	redis = RedisConnection.get_instance()

	if token_type == "access":
		access_key = keys(user_id=user_id, access=True)
		return redis.get(access_key)
	elif token_type == "refresh":
		refresh_key = keys(user_id=user_id, refresh=True)
		return redis.get(refresh_key)
	elif token_type == "activate":
		activate_key = keys(user_id=user_id,activate=True)
		return redis.get(activate_key)
	elif token_type == "recovery":
		recovery_key = keys(user_id=user_id, recovery=True)
		return redis.get(recovery_key)
	else: return None

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