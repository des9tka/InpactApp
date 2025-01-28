from fastapi import FastAPI

from routers import auth_router, user_router, debug_router, project_router, impact_router


app = FastAPI()

app.include_router(router=auth_router)
app.include_router(router=user_router)
app.include_router(router=project_router)
app.include_router(router=impact_router)
app.include_router(router=debug_router)
