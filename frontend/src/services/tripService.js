const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.detail || "The requested operation could not be completed."
    );
  }

  return responseData;
}

export async function generateTrip(tripData) {
  const response = await fetch(`${API_BASE_URL}/trips/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  return handleResponse(response);
}

export async function saveTrip(tripData) {
  const response = await fetch(`${API_BASE_URL}/trips/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  return handleResponse(response);
}

export async function getSavedTrips() {
  const response = await fetch(`${API_BASE_URL}/trips`);

  return handleResponse(response);
}

export async function getSavedTrip(tripId) {
  const response = await fetch(
    `${API_BASE_URL}/trips/${encodeURIComponent(tripId)}`
  );

  return handleResponse(response);
}

export async function deleteSavedTrip(tripId) {
  const response = await fetch(
    `${API_BASE_URL}/trips/${encodeURIComponent(tripId)}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
}