from fastapi.testclient import TestClient

from src.dal.task import create_task
from src.schemas.task import TaskCreate
from sqlalchemy.orm import Session


task_list_data = [{
    "name": "Test task 1",
    "description": "Test task 1 description",
    "status": "New",
    "deadline": "2025-03-20"
}, {
    "name": "Test task 2",
    "description": "Test task 2 description",
    "status": "In progress",
    "deadline": "2026-03-20"
}, {
    "name": "Test task 3",
    "description": "Test task 3 description",
    "status": "Done",
    "deadline": "2025-01-21"
}]


def test_task_create(test_client: TestClient, user_data: tuple[int, str]):
    response = test_client.post(
        "/task",
        json=task_list_data[0],
        headers={
            "Authorization": f"Bearer {user_data[1]}"
        }
    )
    assert response.status_code == 201
    assert {
        "id": 1,
        **task_list_data[0]
    } == response.json()


def test_task_read(
    test_client: TestClient,
    db_session: Session,
    user_data: tuple[int, str]
):
    for task in task_list_data:
        create_task(
            db_session,
            TaskCreate.model_validate(task),
            user_id=user_data[0]
        )

    response = test_client.get(
        "/task?size=10",
        headers={
            "Authorization": f"Bearer {user_data[1]}"
        }
    )
    responce_json = response.json()
    assert response.status_code == 200
    assert responce_json["total"] == len(task_list_data)
    assert responce_json["page"] == 1
    assert len(responce_json["data"]) == len(task_list_data)


def test_task_update(
    test_client: TestClient,
    db_session: Session,
    user_data: tuple[int, str]
):
    task = create_task(
        db_session,
        TaskCreate.model_validate(task_list_data[0]),
        user_id=user_data[0]
    )

    response = test_client.put(
        f"/task/{task.id}",
        headers={
            "Authorization": f"Bearer {user_data[1]}"
        },
        json=task_list_data[1]
    )
    responce_json = response.json()

    assert response.status_code == 200
    assert responce_json == task_list_data[1]


def test_task_delete(
    test_client: TestClient,
    db_session: Session,
    user_data: tuple[int, str]
):
    task = create_task(
        db_session,
        TaskCreate.model_validate(task_list_data[0]),
        user_id=user_data[0]
    )

    response = test_client.delete(
        f"/task/{task.id}",
        headers={
            "Authorization": f"Bearer {user_data[1]}"
        },
    )

    assert response.status_code == 200
