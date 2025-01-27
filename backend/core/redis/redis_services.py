import os
from datetime import timezone, datetime
from jose import jwt, JWTError
from dotenv import load_dotenv
from jose.exceptions import ExpiredSignatureError

from enums.TokenEnums import TokenEnum
from core.redis.db import redis_retry, RedisConnection


load_dotenv()

@redis_retry
async def cleanup_blacklist():
    redis = RedisConnection.get_instance()
    for key in redis.scan_iter("*"):
        if await is_token_blacklisted(key):
            try:
                payload = jwt.decode(key, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
                exp = payload.get("exp", 0)
                if datetime.now(timezone.utc).timestamp() > exp:
                    redis.delete(key)
            except (ExpiredSignatureError, JWTError):
                redis.delete(key)

@redis_retry
async def cleanup_user_tokens(user_id: int):
    redis = RedisConnection.get_instance()
    tokens = await get_user_tokens(user_id)
    valid_tokens = set()
    
    for token in tokens:
        try:
            payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
            valid_tokens.add(token)
        except (ExpiredSignatureError, JWTError):
            continue
    
    if valid_tokens:
        user_key = f"user:{user_id}:tokens"
        redis.delete(user_key)
        redis.sadd(user_key, *valid_tokens)

@redis_retry
async def add_token_to_blacklist(token: str, expiration: int):
    redis = RedisConnection.get_instance()
    redis.set(f"blacklist:{token}", "1", ex=expiration)

@redis_retry
async def is_token_blacklisted(token: str) -> bool:
    redis = RedisConnection.get_instance()
    return redis.exists(f"blacklist:{token}") > 0

@redis_retry
async def store_user_token(user_id: int, token: str, expiration: int):
    redis = RedisConnection.get_instance()
    user_key = f"user:{user_id}:tokens"
    
    redis.sadd(user_key, token)
    redis.expire(user_key, expiration)
    
    reference_token = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
    reference_exp = reference_token.get("exp", 0)
    
    existing_tokens = await get_user_tokens(user_id)
    for old_token in existing_tokens:
        if old_token != token:
            try:
                payload = jwt.decode(old_token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
                token_type = payload.get("type")
                exp = payload.get("exp", 0)
                remaining_ttl = max(0, int(exp - datetime.now(timezone.utc).timestamp()))
                if reference_exp - exp < 10 and token_type == TokenEnum.ACCESS:
                    continue
                elif remaining_ttl > 0:
                    await add_token_to_blacklist(old_token, remaining_ttl)
                else:
                    redis.srem(user_key, old_token)
            except (ExpiredSignatureError, JWTError):
                redis.srem(user_key, old_token)

    
    user_key = f"user:{user_id}:tokens"
    redis.sadd(user_key, token)
    redis.expire(user_key, expiration)

@redis_retry
async def get_user_tokens(user_id: int):
    """Получает все токены пользователя"""
    redis = RedisConnection.get_instance()
    user_key = f"user:{user_id}:tokens"
    return redis.smembers(user_key)
