from slowapi import Limiter
from slowapi.util import get_remote_address


limiter = Limiter(key_func=lambda request: get_remote_address(request))
