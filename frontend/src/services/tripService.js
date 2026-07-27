const API_BASE_URL = "http://127.0.0.1:8000";

function getAccessToken() {
  return localStorage.getItem("tripforge_access_token");
}

function getRequestHeaders(includeContentType = false) {
  const accessToken = getAccessToken();

  const headers = {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

async function handleResponse(response) {
  let responseData = {};

  try {
    responseData = await response.json();
  } catch {
    responseData = {};
  }

  if (response.status === 401) {
    localStorage.removeItem("tripforge_access_token");
    localStorage.removeItem("tripforge_user");

    window.location.href = "/login";

    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!response.ok) {
    throw new Error(
      responseData.detail ||
        "The requested operation could not be completed."
    );
  }

  return responseData;
}

export async function generateTrip(tripData) {
  const response = await fetch(`${API_BASE_URL}/trips/generate`, {
    method: "POST",
    headers: getRequestHeaders(true),
    body: JSON.stringify(tripData),
  });

  return handleResponse(response);
}

export async function saveTrip(tripData) {
  const response = await fetch(`${API_BASE_URL}/trips/save`, {
    method: "POST",
    headers: getRequestHeaders(true),
    body: JSON.stringify(tripData),
  });

  return handleResponse(response);
}

export async function getSavedTrips() {
  const response = await fetch(`${API_BASE_URL}/trips`, {
    headers: getRequestHeaders(),
  });

  return handleResponse(response);
}

export async function getSavedTrip(tripId) {
  const response = await fetch(
    `${API_BASE_URL}/trips/${encodeURIComponent(tripId)}`,
    {
      headers: getRequestHeaders(),
    }
  );

  return handleResponse(response);
}

export async function deleteSavedTrip(tripId) {
  const response = await fetch(
    `${API_BASE_URL}/trips/${encodeURIComponent(tripId)}`,
    {
      method: "DELETE",
      headers: getRequestHeaders(),
    }
  );

  return handleResponse(response);
}