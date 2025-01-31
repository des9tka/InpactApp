import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import bcrypt
bcrypt.kdf # For avoid of delay/mismatch auth __about__ in bcrypt

from core.limiter import limiter
from routers import auth_router, user_router, debug_router, project_router, impact_router


load_dotenv()
app = FastAPI()

web_host = os.getenv("WEB_HOST")
if not web_host:
    raise Exception('Web host was not provided!')

# Cors setup;
app.add_middleware(
    CORSMiddleware,
    allow_origins=[web_host],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Setup limiter;
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from fastapi import Request

# Define a custom exception handler for rate limit exceeded
async def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    # Prepend the "Rate limit exceeded: " prefix to the original message
    full_message = f"Rate limit exceeded: {exc.detail}. Please, try again later."  # Manually add the prefix and postfix
    return JSONResponse(
        status_code=429,
        content={"detail": full_message}  # Wrap the full message under 'detail'
    )

# Use the custom handler in your FastAPI app
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    first_error = exc.errors()[0]
    error_message = first_error.get("msg")
    return JSONResponse(
        status_code=422,
        content={"detail": error_message}
    )

# Include routers;
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(project_router)
app.include_router(impact_router)
app.include_router(debug_router)
