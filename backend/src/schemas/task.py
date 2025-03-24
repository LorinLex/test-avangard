from datetime import date
from enum import Enum
from pydantic import BaseModel, Field

from src.models.task import TaskStatusEnum


class DeadlineFilterEnum(Enum):
    ACTUAL = "Actual"
    MISSED = "Missed"


class TaskActionEnum(Enum):
    CREATED = "Created"
    UPDATED = "Updated"
    DELETED = "Deleted"


class BaseTask(BaseModel):
    name: str | None
    description: str | None
    status: TaskStatusEnum | None
    deadline: date | None


class TaskCreate(BaseTask):
    name: str
    description: str
    status: TaskStatusEnum
    deadline: date


class TaskPublic(TaskCreate):
    id: int


class TaskUpdate(BaseTask):
    name: str | None = None
    description: str | None = None
    status: TaskStatusEnum | None = None
    deadline: date | None = None


class PaginateParams(BaseModel):
    page: int = Field(ge=1, default=1)
    size: int = Field(ge=1, default=1)


class FilterParams(PaginateParams):
    status: TaskStatusEnum | None = None
    deadline: DeadlineFilterEnum | None = None


class TaskPaginated(PaginateParams):
    total: int = Field(ge=0)
    data: list[TaskPublic] = []


class TaskWSActionDelete(BaseModel):
    action: TaskActionEnum
    data: dict[str, int]


class TaskWSActionCreateUpdate(BaseModel):
    action: TaskActionEnum
    data: TaskPublic
