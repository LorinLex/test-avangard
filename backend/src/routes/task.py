from typing import Annotated
from fastapi import APIRouter, Query, status
from sqlalchemy.exc import NoResultFound

from src.exceptions import NoTask, SomeoneElseTask
from src.schemas.task import FilterParams, TaskCreate, TaskPaginated, \
    TaskPublic, TaskUpdate
from src.db import SessionDep
from src.dependencies import UserDeps
from src.dal import task as task_dal


router = APIRouter(prefix="/task", tags=["task"])


@router.get("/search", response_model=list[TaskPublic], status_code=200)
def search_task_list(session: SessionDep, user: UserDeps, query: Annotated[str, Query()]):
    task_list = task_dal.search_task(session, user.id, query, limit=10)
    return task_list


@router.get(
    "",
    response_model=TaskPaginated,
    status_code=status.HTTP_200_OK
)
def get_task_list(
    session: SessionDep,
    user: UserDeps,
    query: Annotated[FilterParams, Query()]
):
    task_list_page, total = task_dal.get_task_list(
        session,
        user.id,
        **query.model_dump()
    )

    return {
        "page": query.page,
        "size": query.size,
        "total": total,
        "data": task_list_page
    }


@router.post(
    "",
    response_model=TaskPublic,
    status_code=status.HTTP_201_CREATED
)
def create_task(session: SessionDep, user: UserDeps, data: TaskCreate):
    return task_dal.create_task(session, task=data, user_id=user.id)


@router.put(
    "/{task_id}",
    response_model=TaskUpdate,
    status_code=status.HTTP_200_OK
)
def update_task(
    session: SessionDep,
    user: UserDeps,
    task_id: int,
    data: TaskUpdate
):
    try:
        return task_dal.update_task(
            session,
            data,
            task_id=task_id,
            user_id=user.id
        )
    except NoResultFound:
        raise NoTask()
    except ValueError:
        raise SomeoneElseTask()


@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(session: SessionDep, user: UserDeps, task_id: int):
    try:
        task_dal.delete_task(session, task_id=task_id, user_id=user.id)
    except NoResultFound:
        raise NoTask()
    except ValueError:
        raise SomeoneElseTask()
