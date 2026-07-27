from typing import Annotated, Any

from fastapi import Header, HTTPException

from services.auth_service import verify_access_token


def get_authenticated_user(
    authorization: Annotated[str | None, Header()] = None,
) -> dict[str, Any]:
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authentication token is required.",
        )

    scheme, separator, token = authorization.partition(" ")

    if (
        separator != " "
        or scheme.lower() != "bearer"
        or not token.strip()
    ):
        raise HTTPException(
            status_code=401,
            detail="A valid bearer token is required.",
        )

    try:
        payload = verify_access_token(token.strip())

        return {
            "name": payload["name"],
            "email": payload["email"],
        }

    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error),
        ) from error