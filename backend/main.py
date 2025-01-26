from fastapi import FastAPI, HTTPException, Depends, Body
from typing import List
from contextlib import asynccontextmanager
from sqlmodel import select, Session
from passlib.hash import bcrypt

from core.db import init_db, get_session 
from models.UserModels import UserModel
from enums.UserEnums import LoginUserEnum
from routers import auth_router, user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
	init_db()
	yield

app = FastAPI(lifespan=lifespan)

app.include_router(router=auth_router)
app.include_router(router=user_router)
