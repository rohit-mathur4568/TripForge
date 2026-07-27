from typing import Annotated

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, EmailStr, Field, field_validator

from services.auth_service import (
    authenticate_user,
    register_user,
    verify_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("name")
    @classmethod
    def validate_name_input(cls, value: str) -> str:
        clean_value = " ".join(value.strip().split())

        if not clean_value:
            raise ValueError("Name is required.")

        return clean_value

    @field_validator("email")
    @classmethod
    def normalise_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password_input(cls, value: str) -> str:
        if value != value.strip():
            raise ValueError(
                "Password cannot start or end with spaces."
            )

        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)

    @field_validator("email")
    @classmethod
    def normalise_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password_input(cls, value: str) -> str:
        if not value:
            raise ValueError("Password is required.")

        return value


@router.post("/register", status_code=201)
def register(request: RegisterRequest):
    try:
        user = register_user(
            name=request.name,
            email=request.email,
            password=request.password,
        )

        return {
            "status": "success",
            "message": "Account created successfully.",
            "user": user,
        }

    except ValueError as error:
        error_message = str(error)

        status_code = (
            409
            if "already exists" in error_message.lower()
            else 400
        )

        raise HTTPException(
            status_code=status_code,
            detail=error_message,
        ) from error

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@router.post("/login")
def login(request: LoginRequest):
    try:
        result = authenticate_user(
            email=request.email,
            password=request.password,
        )

        return {
            "status": "success",
            "message": "Signed in successfully.",
            **result,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error),
        ) from error

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@router.get("/me")
def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authentication token is required.",
        )

    scheme, separator, token = authorization.partition(" ")

    if separator != " " or scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=401,
            detail="A valid bearer token is required.",
        )

    try:
        payload = verify_access_token(token.strip())

        return {
            "status": "success",
            "user": {
                "name": payload["name"],
                "email": payload["email"],
            },
        }

    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error),
        ) from error