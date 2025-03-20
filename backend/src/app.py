from fastapi import FastAPI
from src.settings import settings
from src.routes import user, task

app = FastAPI(
    title=settings.PROJECT_NAME,
)

app.include_router(user.router)
app.include_router(task.router)
