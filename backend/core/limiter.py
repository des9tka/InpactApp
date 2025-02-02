from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize the Limiter instance with a function to get the client's IP address for rate limiting
limiter = Limiter(key_func=lambda request: get_remote_address(request))

