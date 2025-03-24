from typing import Annotated
from fastapi import Depends, Request
from fastapi.security.base import SecurityBase
from fastapi.security.utils import get_authorization_scheme_param
from fastapi.openapi.models import HTTPBearer as HTTPBearerModel
from jwt import InvalidTokenError
from sqlalchemy.exc import NoResultFound

from src.dal.user import get_user
from src.exceptions import Unauthorized
from src.models.user import User
from src.db import SessionDep
from src.utils import decode_jwt


class UserJWTBearer(SecurityBase):
    """
    User dependency. This class is reworked HTTPBearer class from FastAPI.
    Made for Swagger UI.
    Bases on Security base due signature difference of __call__ methods.
    """

    def __init__(self):
        self.model = HTTPBearerModel(
            bearerFormat="JWT",
            description="JWT Token"
        )
        self.scheme_name = "JWT Bearer"

    async def __call__(self, request: Request, session: SessionDep) -> User:
        authorization = request.headers.get("Authorization")
        scheme, credentials = get_authorization_scheme_param(authorization)
        if not (authorization and scheme and credentials):
            raise Unauthorized()

        if scheme.lower() != "bearer":
            raise Unauthorized()

        try:
            decoded_data = decode_jwt(credentials)
            email = decoded_data["email"]
            return get_user(session, email)
        except (NoResultFound, KeyError, InvalidTokenError):
            raise Unauthorized()


UserDeps = Annotated[User, Depends(UserJWTBearer())]
