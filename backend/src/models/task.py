from datetime import date
from enum import Enum

from sqlalchemy import ForeignKey
from src.models.base import Base
from sqlalchemy.orm import Mapped, mapped_column

from src.models.user import User


class TaskStatusEnum(Enum):
    NEW = "New"
    IN_PROGRESS = "In progress"
    DONE = "Done"


class Task(Base):
    __tablename__ = "Task"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str]
    status: Mapped[TaskStatusEnum] = mapped_column(default=TaskStatusEnum.NEW)
    deadline: Mapped[date]
    user_id: Mapped[int] = mapped_column(ForeignKey(User.id))
