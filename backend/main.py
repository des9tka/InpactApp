import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import auth_router, user_router, debug_router, project_router, impact_router

load_dotenv()
app = FastAPI()

web_host = os.getenv("WEB_HOST")

if not web_host:
	raise Exception('Web host was not provided!')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEB_HOST")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router=auth_router)
app.include_router(router=user_router)
app.include_router(router=project_router)
app.include_router(router=impact_router)
app.include_router(router=debug_router)
