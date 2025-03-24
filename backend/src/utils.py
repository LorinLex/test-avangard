import base64
import hmac
import hashlib
from typing import Any
import jwt
from src.settings import settings


def hash_data(
    data: str,
    key: str = settings.SECRET_KEY,
    algorithm=hashlib.sha256
) -> str:
    digets = hmac.new(
        bytes(key, "utf-8"),
        bytes(data, "utf-8"),
        algorithm
    ).digest()

    return base64.b64encode(digets).decode("utf-8")


def verify_hashed(
    signature: str,
    data: str,
    key: str = settings.SECRET_KEY,
    algorithm=hashlib.sha256
) -> bool:
    expected = hash_data(data, key, algorithm)
    return hmac.compare_digest(
        expected.encode("utf-8"),
        signature.encode("utf-8")
    )


def encode_jwt(payload: dict[str, Any]) -> str:
    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256"
    )


def decode_jwt(token: str) -> dict[str, Any]:
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=["HS256"]
    )
