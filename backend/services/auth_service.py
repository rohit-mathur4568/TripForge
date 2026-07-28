import os
import re
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from dotenv import load_dotenv

from database.db_store import get_user_by_email
from database.db_store import create_user as _create_user_db

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(
    os.getenv("JWT_EXPIRATION_HOURS", "12")
)

NAME_PATTERN = re.compile(r"^[A-Za-z]+(?: [A-Za-z]+)*$")
PASSWORD_UPPERCASE_PATTERN = re.compile(r"[A-Z]")
PASSWORD_LOWERCASE_PATTERN = re.compile(r"[a-z]")
PASSWORD_NUMBER_PATTERN = re.compile(r"\d")
PASSWORD_SPECIAL_PATTERN = re.compile(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]")

if not JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET is missing from the environment configuration."
    )


def normalise_name(name: str) -> str:
    clean_name = " ".join(name.strip().split())

    if len(clean_name) < 2:
        raise ValueError(
            "Name must contain at least 2 characters."
        )

    if len(clean_name) > 50:
        raise ValueError(
            "Name cannot contain more than 50 characters."
        )

    if not NAME_PATTERN.fullmatch(clean_name):
        raise ValueError(
            "Name can contain only letters and single spaces."
        )

    return clean_name


def validate_password(password: str) -> None:
    if len(password) < 8:
        raise ValueError(
            "Password must contain at least 8 characters."
        )

    if len(password) > 72:
        raise ValueError(
            "Password cannot contain more than 72 characters."
        )

    if any(character.isspace() for character in password):
        raise ValueError(
            "Password cannot contain spaces."
        )

    if not PASSWORD_UPPERCASE_PATTERN.search(password):
        raise ValueError(
            "Password must contain at least one uppercase letter."
        )

    if not PASSWORD_LOWERCASE_PATTERN.search(password):
        raise ValueError(
            "Password must contain at least one lowercase letter."
        )

    if not PASSWORD_NUMBER_PATTERN.search(password):
        raise ValueError(
            "Password must contain at least one number."
        )

    if not PASSWORD_SPECIAL_PATTERN.search(password):
        raise ValueError(
            "Password must contain at least one special character."
        )


def register_user(
    name: str,
    email: str,
    password: str,
) -> dict[str, Any]:
    import uuid

    clean_name = normalise_name(name)
    normalised_email = email.strip().lower()

    validate_password(password)

    if get_user_by_email(normalised_email):
        raise ValueError("An account with this email already exists.")

    user_id = str(uuid.uuid4())
    created_user = _create_user_db(
        user_id=user_id,
        email=normalised_email,
        password=password,
        full_name=clean_name,
    )

    return {
        "name": created_user["full_name"],
        "email": created_user["email"],
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }


def authenticate_user(
    email: str,
    password: str,
) -> dict[str, Any]:
    import hashlib

    normalised_email = email.strip().lower()

    if not password:
        raise ValueError("Invalid email or password.")

    user = get_user_by_email(normalised_email)

    if not user:
        raise ValueError("Invalid email or password.")

    # db_store uses sha256 hashing
    pwd_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    if user["password_hash"] != pwd_hash:
        raise ValueError("Invalid email or password.")

    token = create_access_token(
        {
            "email": user["email"],
            "name": user["full_name"],
        }
    )

    return {
        "accessToken": token,
        "tokenType": "bearer",
        "user": {
            "name": user["full_name"],
            "email": user["email"],
        },
    }


def create_access_token(payload: dict[str, Any]) -> str:
    current_time = datetime.now(timezone.utc)

    token_payload = {
        **payload,
        "exp": current_time
        + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": current_time,
    }

    return jwt.encode(
        token_payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def verify_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )

    except jwt.ExpiredSignatureError as error:
        raise ValueError(
            "Your session has expired. Please sign in again."
        ) from error

    except jwt.InvalidTokenError as error:
        raise ValueError(
            "Invalid authentication token."
        ) from error