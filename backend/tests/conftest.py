from typing import Generator
from fastapi.testclient import TestClient
from pydantic import PostgresDsn
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from src.dal.user import create_user
from src.db import get_session
from src.schemas.user import UserCreate
from src.settings import settings
from sqlalchemy.exc import ProgrammingError
import pytest
from src.app import app
from src.models.base import Base
from src.utils import encode_jwt


TEST_SQLALCHEMY_DATABASE_URL: str = \
    settings.DB_URL.unicode_string()


ADMIN_SQLALCHEMY_DATABASE_URL: str = \
    PostgresDsn.build(
        scheme="postgresql+psycopg2",
        username=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        host=settings.POSTGRES_HOST,
        port=settings.POSTGRES_PORT,
        path="postgres"
    ).unicode_string()


engine = create_engine(TEST_SQLALCHEMY_DATABASE_URL)
admin_engine = create_engine(ADMIN_SQLALCHEMY_DATABASE_URL)
test_session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def create_test_database() -> None:
    """Create the test database if it doesn't exist."""
    with admin_engine.connect() as connection:
        connection = connection.execution_options(isolation_level="AUTOCOMMIT")
        try:
            connection.execute(
                text("CREATE DATABASE "
                     f"{TEST_SQLALCHEMY_DATABASE_URL.split('/')[-1]};")
            )
            print("Database created!")
        except ProgrammingError:
            print("Database already exists, continuing...")


@pytest.fixture(scope="session", autouse=True)
def setup_test_database() -> Generator[None, None, None]:
    """
    Create the test database schema before any tests run,
    and drop it after all tests are done.
    """
    create_test_database()
    with engine.connect() as conn:
        Base.metadata.create_all(conn)
        conn.commit()

    yield

    with engine.connect() as conn:
        Base.metadata.drop_all(conn)
        conn.commit()


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """
    Create a new database session for each test and roll it back after
    the test.
    """
    with engine.connect() as connection:
        with connection.begin() as transaction:
            with test_session(bind=connection) as session:
                yield session
            transaction.rollback()


@pytest.fixture(scope="function")
def test_client(db_session: Session) -> Generator[TestClient, None, None]:
    """
    Create a test client that uses the override_get_db fixture to return
    a session.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_session] = override_get_db
    with TestClient(app=app, base_url="http://testserver") as test_client:
        yield test_client


@pytest.fixture(scope="function")
def user_data(db_session: Session) -> tuple[int, str]:
    user_register_data = {
        "username": "test_username",
        "email": "test@test.com",
        "password": "test@test.com"
    }

    user = create_user(
        db_session,
        UserCreate.model_validate(user_register_data)
    )

    token = encode_jwt({"email": user_register_data["email"]})

    return (user.id, token)
