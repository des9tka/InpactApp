import os
from datetime import timezone, datetime
from jose import jwt, JWTError
from redis import Redis, ConnectionError
from dotenv import load_dotenv
from jose.exceptions import ExpiredSignatureError
import time
from typing import Optional
from functools import wraps

load_dotenv()

class RedisConnection:
    _instance: Optional[Redis] = None
    _max_retries = 3
    _retry_delay = 1  # seconds

    @classmethod
    def get_instance(cls) -> Redis:
        if cls._instance is None:
            cls._instance = cls._create_connection()
        return cls._instance

    @classmethod
    def _create_connection(cls) -> Redis:
        return Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            db=0,
            decode_responses=True,
            socket_connect_timeout=5,
            retry_on_timeout=True
        )

    @classmethod
    def reset_connection(cls):
        if cls._instance:
            try:
                cls._instance.close()
            except:
                pass
        cls._instance = None

def redis_retry(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        for attempt in range(RedisConnection._max_retries):
            try:
                return await func(*args, **kwargs)
            except ConnectionError:
                if attempt == RedisConnection._max_retries - 1:
                    raise
                RedisConnection.reset_connection()
                time.sleep(RedisConnection._retry_delay)
        return await func(*args, **kwargs)
    return wrapper

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
    """Добавляет токен в черный список"""
    redis = RedisConnection.get_instance()
    redis.set(f"blacklist:{token}", "1", ex=expiration)

@redis_retry
async def is_token_blacklisted(token: str) -> bool:
    """Проверяет, находится ли токен в черном списке"""
    redis = RedisConnection.get_instance()
    return redis.exists(f"blacklist:{token}") > 0

@redis_retry
async def store_user_token(user_id: int, token: str, expiration: int):
    redis = RedisConnection.get_instance()
    user_key = f"user:{user_id}:tokens"
    
    # Добавляем новый токен
    redis.sadd(user_key, token)
    redis.expire(user_key, expiration)
    
    # Удаляем или добавляем старые токены в черный список
    existing_tokens = await get_user_tokens(user_id)
    for old_token in existing_tokens:
        if old_token != token:  # Исключаем текущий токен
            try:
                payload = jwt.decode(old_token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
                exp = payload.get("exp", 0)
                remaining_ttl = max(0, int(exp - datetime.now(timezone.utc).timestamp()))
                if remaining_ttl > 0:
                    await add_token_to_blacklist(old_token, remaining_ttl)
            except (ExpiredSignatureError, JWTError):
                continue
    
    user_key = f"user:{user_id}:tokens"
    redis.sadd(user_key, token)
    redis.expire(user_key, expiration)

@redis_retry
async def get_user_tokens(user_id: int):
    """Получает все токены пользователя"""
    redis = RedisConnection.get_instance()
    user_key = f"user:{user_id}:tokens"
    return redis.smembers(user_key)