import os
from redis import Redis, ConnectionError
from dotenv import load_dotenv
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
