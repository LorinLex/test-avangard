from fastapi import FastAPI
from src.settings import get_settings

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)
