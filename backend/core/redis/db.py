import os
from redis import Redis, ConnectionError
from dotenv import load_dotenv
import time
from typing import Optional
from functools import wraps

# Load environment variables from a .env file
load_dotenv()

class RedisConnection:
    # Singleton pattern to ensure only one Redis connection instance is created
    _instance: Optional[Redis] = None
    _max_retries = 3  # Maximum retry attempts on connection failure
    _retry_delay = 1  # Delay between retries in seconds

    @classmethod
    def get_instance(cls) -> Redis:
        """Returns the Redis instance, creating it if necessary."""
        if cls._instance is None:
            cls._instance = cls._create_connection()
        return cls._instance

    @classmethod
    def _create_connection(cls) -> Redis:
        """Creates and returns a new Redis connection."""
        return Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            db=0,
            decode_responses=True,
            socket_connect_timeout=5,  # Timeout for socket connection
            retry_on_timeout=True  # Automatically retries on timeout
        )

    @classmethod
    def reset_connection(cls):
        """Resets the current Redis connection."""
        if cls._instance:
            try:
                cls._instance.close()  # Close the connection gracefully
            except:
                pass
        cls._instance = None  # Reset the instance

# Decorator to automatically retry Redis operations on failure
def redis_retry(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # Retry logic with a max number of attempts and delay between retries
        for attempt in range(RedisConnection._max_retries):
            try:
                return await func(*args, **kwargs)
            except ConnectionError:
                if attempt == RedisConnection._max_retries - 1:
                    raise  # Raise the error after max retries
                RedisConnection.reset_connection()  # Reset connection if error occurs
                time.sleep(RedisConnection._retry_delay)  # Wait before retrying
        return await func(*args, **kwargs)  # Retry once more if the loop completes
    return wrapper
