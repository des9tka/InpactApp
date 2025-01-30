import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from slowapi import Limiter
from slowapi.util import get_remote_address

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
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter 

# Include limited in routers; 
app.include_router(auth_router, dependencies=[limiter])
app.include_router(user_router, dependencies=[limiter])
app.include_router(project_router, dependencies=[limiter])
app.include_router(impact_router, dependencies=[limiter])
app.include_router(debug_router, dependencies=[limiter])
