from typing import Annotated, Generator
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from src.settings import settings


_engine = create_engine(
    settings.DB_URL.unicode_string(),
    echo=True,
    future=True
)
_session_factory = sessionmaker(
    _engine,
    expire_on_commit=False
)


def get_session() -> Generator[Session, None, None]:
    with _session_factory() as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
