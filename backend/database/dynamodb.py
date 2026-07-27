from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

import boto3
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import BotoCoreError, ClientError


TABLE_NAME = "TripForgeTrips"
AWS_REGION = "ap-south-1"

dynamodb = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION,
)

table = dynamodb.Table(TABLE_NAME)


def _convert_numbers(value: Any) -> Any:
    if isinstance(value, float):
        return Decimal(str(value))

    if isinstance(value, dict):
        return {
            key: _convert_numbers(item)
            for key, item in value.items()
        }

    if isinstance(value, list):
        return [_convert_numbers(item) for item in value]

    return value


def save_trip(
    trip_data: dict[str, Any],
    owner: dict[str, Any],
) -> dict[str, Any]:
    item = {
        **trip_data,
        "ownerEmail": owner["email"],
        "ownerName": owner["name"],
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    converted_item = _convert_numbers(item)

    try:
        table.put_item(Item=converted_item)

        return {
            "message": "Journey saved successfully.",
            "tripId": trip_data["tripId"],
        }

    except (ClientError, BotoCoreError) as error:
        raise RuntimeError(
            "Unable to save the journey."
        ) from error


def get_user_trips(owner_email: str) -> list[dict[str, Any]]:
    try:
        response = table.scan(
            FilterExpression=Attr("ownerEmail").eq(
                owner_email.strip().lower()
            )
        )

        items = response.get("Items", [])

        while "LastEvaluatedKey" in response:
            response = table.scan(
                FilterExpression=Attr("ownerEmail").eq(
                    owner_email.strip().lower()
                ),
                ExclusiveStartKey=response["LastEvaluatedKey"],
            )

            items.extend(response.get("Items", []))

        return sorted(
            items,
            key=lambda item: item.get("createdAt", ""),
            reverse=True,
        )

    except (ClientError, BotoCoreError) as error:
        raise RuntimeError(
            "Unable to load saved journeys."
        ) from error


def get_trip_by_id(
    trip_id: str,
    owner_email: str,
) -> dict[str, Any] | None:
    try:
        response = table.get_item(
            Key={
                "tripId": trip_id,
            }
        )

        trip = response.get("Item")

        if not trip:
            return None

        if trip.get("ownerEmail") != owner_email.strip().lower():
            return None

        return trip

    except (ClientError, BotoCoreError) as error:
        raise RuntimeError(
            "Unable to load the selected journey."
        ) from error


def delete_trip(
    trip_id: str,
    owner_email: str,
) -> bool:
    existing_trip = get_trip_by_id(
        trip_id=trip_id,
        owner_email=owner_email,
    )

    if not existing_trip:
        return False

    try:
        response = table.delete_item(
            Key={
                "tripId": trip_id,
            },
            ReturnValues="ALL_OLD",
        )

        return "Attributes" in response

    except (ClientError, BotoCoreError) as error:
        raise RuntimeError(
            "Unable to delete the journey."
        ) from error