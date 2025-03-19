from fastapi import APIRouter, Response
from sqlalchemy.exc import NoResultFound

from src.dal.user import create_user, get_user
from src.exceptions import AuthException, EmailDuplicate
from src.schemas.user import UserAuth, UserCreate, UserPublic
from src.db import SessionDep
from src.utils import encode_jwt, verify_hashed


router = APIRouter(prefix="/user", tags=["user"])


@router.post(
    path="/register",
    response_model=UserPublic,
    status_code=201,
    responses={
        201: {"description": "User registered"},
        400: {"description": "Email is already registered"}
    },
    description="User registration route."
)
def register(data: UserCreate, session: SessionDep):
    try:
        return create_user(session=session, data=data)
    except ValueError:
        raise EmailDuplicate()


@router.post(
    path="/auth",
    response_model=UserPublic,
    responses={
        200: {"description": "Authorization successful"},
        400: {"description": "Wrong email or password"},
    },
    description="User authorization route. "
                "On success adds header 'Authorization' to response"
)
def auth(response: Response, data: UserAuth, session: SessionDep):
    try:
        user_db = get_user(session, email=str(data.email))
    except NoResultFound:
        raise AuthException()

    if not verify_hashed(
        user_db.hashed_password,
        data.password.get_secret_value()
    ):
        raise AuthException()

    token = encode_jwt(data.model_dump(include={"email": True}))

    response.headers["Authorization"] = f"Bearer {token}"
    return user_db
