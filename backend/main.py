from fastapi import FastAPI

from routers import auth_router, user_router


app = FastAPI()

app.include_router(router=auth_router)
app.include_router(router=user_router)
