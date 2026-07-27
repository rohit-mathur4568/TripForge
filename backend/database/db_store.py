import os
import sqlite3
import hashlib
import json
from datetime import datetime, timezone
from typing import Any, List, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "tripforge.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trips (
        tripId TEXT PRIMARY KEY,
        user_id TEXT,
        data JSON NOT NULL,
        createdAt TEXT NOT NULL
    )
    """)
    
    conn.commit()
    conn.close()

init_db()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def create_user(user_id: str, email: str, password: str, full_name: str) -> dict:
    conn = get_db()
    cursor = conn.cursor()
    pwd_hash = hash_password(password)
    now = datetime.now(timezone.utc).isoformat()
    try:
        cursor.execute(
            "INSERT INTO users (id, email, password_hash, full_name, created_at) VALUES (?, ?, ?, ?, ?)",
            (user_id, email.lower().strip(), pwd_hash, full_name, now)
        )
        conn.commit()
        return {"id": user_id, "email": email.lower().strip(), "full_name": full_name}
    except sqlite3.IntegrityError:
        raise ValueError("User with this email already exists.")
    finally:
        conn.close()

def get_user_by_email(email: str) -> Optional[dict]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def get_user_by_id(user_id: str) -> Optional[dict]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name, created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def save_trip_db(trip_data: dict, user_id: Optional[str] = None) -> dict:
    trip_id = trip_data.get("tripId")
    now = datetime.now(timezone.utc).isoformat()
    trip_data["createdAt"] = now
    if user_id:
        trip_data["userId"] = user_id

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO trips (tripId, user_id, data, createdAt) VALUES (?, ?, ?, ?)",
        (trip_id, user_id, json.dumps(trip_data), now)
    )
    conn.commit()
    conn.close()

    try:
        from database.dynamodb import save_trip as save_dynamo
        save_dynamo(trip_data)
    except Exception:
        pass

    return {"message": "Journey saved successfully.", "tripId": trip_id}

def get_all_trips_db(user_id: Optional[str] = None) -> List[dict]:
    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT data FROM trips WHERE user_id = ? ORDER BY createdAt DESC", (user_id,))
    else:
        cursor.execute("SELECT data FROM trips ORDER BY createdAt DESC")
    rows = cursor.fetchall()
    conn.close()

    trips = []
    for r in rows:
        try:
            trips.append(json.loads(r["data"]))
        except Exception:
            pass

    if trips:
        return trips

    try:
        from database.dynamodb import get_all_trips as get_dynamo
        return get_dynamo()
    except Exception:
        return []

def get_trip_by_id_db(trip_id: str) -> Optional[dict]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM trips WHERE tripId = ?", (trip_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["data"])

    try:
        from database.dynamodb import get_trip_by_id as get_dynamo
        return get_dynamo(trip_id)
    except Exception:
        return None

def delete_trip_db(trip_id: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM trips WHERE tripId = ?", (trip_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()

    try:
        from database.dynamodb import delete_trip as delete_dynamo
        delete_dynamo(trip_id)
    except Exception:
        pass

    return deleted
