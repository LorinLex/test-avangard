from pydantic import BaseModel, EmailStr, SecretStr, computed_field, \
    field_serializer

from src.utils import hash_data


class BaseUser(BaseModel):
    username: str | None
    email: EmailStr | None


class UserPublic(BaseUser):
    id: int
    username: str
    email: EmailStr


class UserCreate(BaseUser):
    username: str
    email: EmailStr
    password: SecretStr

    @computed_field  # type: ignore[prop-decorator]
    @property
    def hashed_password(self) -> str:
        return hash_data(self.password.get_secret_value())

    @field_serializer('password')
    def dump_secret(self, v):
        return v.get_secret_value()


class UserAuth(BaseModel):
    email: EmailStr
    password: SecretStr

    @field_serializer('password')
    def dump_secret(self, v):
        return v.get_secret_value()


class Token(BaseModel):
    token: str
