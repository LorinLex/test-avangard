from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from src.dal.user import create_user
from src.schemas.user import UserCreate

user_auth_data = {
    "email": "test@test.com",
    "password": "test@test.com"
}

user_register_data = {
    "username": "test_username",
    **user_auth_data
}


def test_create_user(test_client: TestClient):
    response = test_client.post(
        "/user/register",
        json=user_register_data,
    )
    assert response.status_code == 201
    response_json: dict[str, str | int] = response.json()
    assert response_json["email"] == user_register_data["email"]
    assert response_json["username"] == user_register_data["username"]


def test_create_user_missing_data(test_client: TestClient):
    response = test_client.post(
        "/user/register",
        json={},
    )
    assert response.status_code == 422


def test_user_auth(test_client: TestClient, db_session: Session):
    create_user(
        db_session,
        UserCreate.model_validate(user_register_data)
    )

    response = test_client.post(
        "/user/auth",
        json=user_auth_data
    )
    assert response.status_code == 200
    assert "token" in response.json()
