from datetime import date
from sqlalchemy.orm import Session

from src.models.task import Task, TaskStatusEnum
from src.schemas.task import DeadlineFilterEnum, TaskCreate, TaskUpdate


def get_task_list(
    session: Session,
    user_id: int,
    page: int = 1,
    size: int = 10,
    status: TaskStatusEnum | None = None,
    deadline: DeadlineFilterEnum | None = None,
    search_query: str | None = None
) -> tuple[list[Task], int]:
    query = session.query(Task).where(Task.user_id == user_id)

    if search_query is not None:
        name_query = query.where(Task.name.ilike(f"%{search_query}%"))
        desc_query = query.where(Task.description.ilike(f"%{search_query}%"))
        query = name_query.union(desc_query)
    if status is not None:
        query = query.where(Task.status == status)
    if deadline == DeadlineFilterEnum.ACTUAL:
        query = query.where(Task.deadline >= date.today())
    elif deadline == DeadlineFilterEnum.MISSED:
        query = query.where(Task.deadline < date.today())

    task_list_page = query.offset((page - 1) * size).limit(size).all()
    task_count = query.count()

    return (task_list_page, task_count)


def create_task(session: Session, task: TaskCreate, user_id: int) -> Task:
    task_db = Task(**task.model_dump(), user_id=user_id)
    session.add(task_db)
    session.commit()
    session.refresh(task_db)
    return task_db


def update_task(
    session: Session,
    data: TaskUpdate,
    user_id: int,
    task_id: int
) -> Task:
    task_db = session.get_one(Task, task_id)
    if task_db.user_id != user_id:
        raise ValueError("Task belongs to someone else")

    update_data_dict = data.model_dump(exclude_none=True)
    for key, value in update_data_dict.items():
        setattr(task_db, key, value)
    session.add(task_db)
    session.commit()
    session.refresh(task_db)
    return task_db


def delete_task(session: Session, task_id: int, user_id: int) -> None:
    task_db = session.get_one(Task, task_id)
    if task_db.user_id != user_id:
        raise ValueError("Task belongs to someone else")
    session.delete(task_db)
    session.commit()
