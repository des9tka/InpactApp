import os
from datetime import timezone, datetime
from jose import jwt, JWTError
from dotenv import load_dotenv
from jose.exceptions import ExpiredSignatureError
from typing import Optional

from core.redis.db import redis_retry, RedisConnection


load_dotenv()

# Helper function to generate token keys based on user and token type
def keys(
    user_id, 
    access: Optional[bool] = False, 
    refresh: Optional[bool] = False,
    activate: Optional[bool] = False, 
    recovery: Optional[bool] = False,
    invite: Optional[bool] = False
) -> Optional[str]:
    if access: return f"user:{user_id}:access_token"
    elif refresh: return f"user:{user_id}:refresh_token"
    elif activate: return f"user:{user_id}:activate_token"
    elif recovery: return f"user:{user_id}:recovery_token"
    elif invite: return f"user:{user_id}:invite_token"
    else: return None

# Store various user tokens in Redis with expiration times
@redis_retry
async def store_user_token(
    user_id: int, 
    access_expiration: Optional[int] = None, 
    refresh_expiration: Optional[int] = None, 
    activate_expiration: Optional[int] = None, 
    recovery_expiration: Optional[int] = None, 
    invite_expiration: Optional[int] = None,
    access_token: Optional[str] = None, 
    refresh_token: Optional[str] = None,
    activate_token: Optional[str] = None, 
    recovery_token: Optional[str] = None,
    invite_token: Optional[str] = None,
    project_id: Optional[int] = None
):
    redis = RedisConnection.get_instance()

    # Store each token type with its expiration time if provided
    if access_token and access_expiration:
        access_key = keys(user_id=user_id, access=True)
        redis.delete(access_key)  # Delete existing token if it exists
        redis.set(access_key, access_token, ex=access_expiration)  # Set new token with expiration

    if refresh_token and refresh_expiration:
        refresh_key = keys(user_id=user_id, refresh=True)
        redis.delete(refresh_key)
        redis.set(refresh_key, refresh_token, ex=refresh_expiration)

    if activate_token and activate_expiration:
        activate_key = keys(user_id=user_id, activate=True)
        redis.delete(activate_key)
        redis.set(activate_key, activate_token, ex=activate_expiration)

    if recovery_token and recovery_expiration:
        recovery_key = keys(user_id=user_id, recovery=True)    
        redis.delete(recovery_key)
        redis.set(recovery_key, recovery_token, ex=recovery_expiration)

    if invite_token and invite_expiration and project_id:
        invite_key = keys(user_id=user_id, invite=True) + ":" + str(project_id)
        redis.delete(invite_key)
        redis.set(invite_key, invite_token, ex=invite_expiration)

# Check if a token exists in Redis and matches the provided token
@redis_retry
async def is_in_store(
    user_id: int, 
    access_token: Optional[str] = None, 
    refresh_token: Optional[str] = None,
    activate_token: Optional[str] = None, 
    recovery_token: Optional[str] = None,
    invite_token: Optional[str] = None,
    project_id: Optional[int] = None
):
    redis = RedisConnection.get_instance()
         
    # Check if the specified token exists and matches the value in Redis
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
        if redis.get(recovery_key) != recovery_token:
            return None

    elif invite_token and project_id:
        invite_key = keys(user_id=user_id, invite=True) + ":" + str(project_id)
        if redis.get(invite_key) != invite_token:
            return None
    else: 
        return None
    
    return True

# Remove specific user tokens from Redis
@redis_retry
async def remove_tokens(
    user_id: int,
    access_token: Optional[bool] = None, 
    refresh_token: Optional[bool] = None,
    activate_token: Optional[bool] = None, 
    recovery_token: Optional[bool] = None,
    invite_token: Optional[bool] = None,
    project_id: Optional[int] = None
):
    redis = RedisConnection.get_instance()

    # Delete the specified token type from Redis
    if access_token:
        access_key = keys(user_id=user_id, access=True)
        redis.delete(access_key)
    elif refresh_token:
        refresh_key = keys(user_id=user_id, refresh=True)
        redis.delete(refresh_key)
    elif activate_token:
        activate_key = keys(user_id=user_id, activate=True)
        redis.delete(activate_key)
    elif recovery_token:
        recovery_key = keys(user_id=user_id, recovery=True)
        redis.delete(recovery_key)
    elif invite_token:
        invite_key = keys(user_id=user_id, invite=True) + ":" + str(project_id)
        redis.delete(invite_key)
    else: 
        return None
    return True

# Get the token value from Redis based on token type
@redis_retry
async def get_token_by_user_id(user_id: int, token_type: str, project_id: Optional[int] = None):
    redis = RedisConnection.get_instance()

    # Retrieve the appropriate token from Redis based on type
    if token_type == "access":
        access_key = keys(user_id=user_id, access=True)
        return redis.get(access_key)
    elif token_type == "refresh":
        refresh_key = keys(user_id=user_id, refresh=True)
        return redis.get(refresh_key)
    elif token_type == "activate":
        activate_key = keys(user_id=user_id, activate=True)
        return redis.get(activate_key)
    elif token_type == "recovery":
        recovery_key = keys(user_id=user_id, recovery=True)
        return redis.get(recovery_key)
    elif token_type == "invite":
        recovery_key = keys(user_id=user_id, invite=True) + ":" + str(project_id)
        return redis.get(recovery_key)
    else: 
        return None

# Debugging: Retrieve all information from Redis
@redis_retry
async def get_all_info_from_redis():
    state = []
    redis = RedisConnection.get_instance()
    cursor, keys = redis.scan(cursor=0)  # Get keys with scan method
    for key in keys:
        value = redis.get(key)  # Get value for each key
        state.append(f"Key: {key}, Value: {value}")
    return state

# Debugging: Clear all data from Redis
@redis_retry
async def clear_redis():
    redis = RedisConnection.get_instance()
    redis.flushall()  # Clear all Redis data
    return True


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