from datetime import datetime, timezone
from typing import Any

import boto3
from botocore.exceptions import BotoCoreError, ClientError

USERS_TABLE_NAME = "TripForgeUsers"
AWS_REGION = "ap-south-1"

dynamodb = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION,
)

users_table = dynamodb.Table(USERS_TABLE_NAME)


def create_user(user_data: dict[str, Any]) -> dict[str, Any]:
    item = {
        **user_data,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    try:
        users_table.put_item(
            Item=item,
            ConditionExpression="attribute_not_exists(email)",
        )

        return item

    except ClientError as error:
        error_code = error.response.get("Error", {}).get("Code")

        if error_code == "ConditionalCheckFailedException":
            raise ValueError(
                "An account with this email already exists."
            ) from error

        raise RuntimeError(
            "Unable to create the account."
        ) from error

    except BotoCoreError as error:
        raise RuntimeError(
            "Unable to create the account."
        ) from error


def get_user_by_email(email: str) -> dict[str, Any] | None:
    try:
        response = users_table.get_item(
            Key={
                "email": email.strip().lower(),
            }
        )

        return response.get("Item")

    except (ClientError, BotoCoreError) as error:
        raise RuntimeError(
            "Unable to load the account."
        ) from error