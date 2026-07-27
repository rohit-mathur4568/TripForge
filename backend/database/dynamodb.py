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


def save_trip(trip_data: dict[str, Any]) -> dict[str, Any]:
    item = {
        **trip_data,
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


def get_all_trips() -> list[dict[str, Any]]:
    try:
        response = table.scan()
        items = response.get("Items", [])

        while "LastEvaluatedKey" in response:
            response = table.scan(
                ExclusiveStartKey=response["LastEvaluatedKey"]
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


def get_trip_by_id(trip_id: str) -> dict[str, Any] | None:
    try:
        response = table.get_item(
            Key={
                "tripId": trip_id,
            }
        )

        return response.get("Item")

    except (ClientError, BotoCoreError) as error:
        raise RuntimeError(
            "Unable to load the selected journey."
        ) from error


def delete_trip(trip_id: str) -> bool:
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


def trip_exists(trip_id: str) -> bool:
    try:
        response = table.scan(
            FilterExpression=Attr("tripId").eq(trip_id),
            ProjectionExpression="tripId",
        )

        return len(response.get("Items", [])) > 0

    except (ClientError, BotoCoreError) as error:
        raise RuntimeError(
            "Unable to verify the journey."
        ) from error