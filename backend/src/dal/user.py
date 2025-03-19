from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.models.user import User
from src.schemas.user import UserCreate


def get_user(session: Session, email: str) -> User:
    return session.query(User).where(User.email == email).one()


def create_user(session: Session, data: UserCreate) -> User:
    try:
        dump = data.model_dump(
            exclude={"password": True}
        )
        user_db = User(**dump)

        session.add(user_db)
        session.commit()
        session.refresh(user_db)
        return user_db
    except IntegrityError:
        raise ValueError("Email duplicates")
