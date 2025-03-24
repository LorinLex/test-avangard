from fastapi import APIRouter, Response
from sqlalchemy.exc import NoResultFound

from src.dal.user import create_user, get_user
from src.exceptions import AuthException, EmailDuplicate
from src.schemas.user import Token, UserAuth, UserCreate, UserPublic
from src.db import SessionDep
from src.utils import encode_jwt, verify_hashed
from src.dependencies import UserDeps


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
    response_model=Token,
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

    return {
        "token": token
    }


@router.get(
    path="/me",
    response_model=UserPublic,
    responses={
        200: {"description": "Authentication successful"},
        400: {"description": "Wrong token"},
    },
    description="User authentication route. "
                "On success sends in body user data."
)
def me(user: UserDeps):
    return user
