const API_BASE_URL = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("tf_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      responseData.detail || "The requested operation could not be completed."
    );
  }

  return responseData;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function signupUser(fullName, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });
  return handleResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function generateTrip(tripData) {
  const response = await fetch(`${API_BASE_URL}/trips/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(tripData),
  });

  return handleResponse(response);
}

export async function saveTrip(tripData) {
  const response = await fetch(`${API_BASE_URL}/trips/save`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(tripData),
  });

  return handleResponse(response);
}

export async function getSavedTrips() {
  const response = await fetch(`${API_BASE_URL}/trips`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getSavedTrip(tripId) {
  const response = await fetch(
    `${API_BASE_URL}/trips/${encodeURIComponent(tripId)}`,
    { headers: getAuthHeaders() }
  );

  return handleResponse(response);
}

export async function deleteSavedTrip(tripId) {
  const response = await fetch(
    `${API_BASE_URL}/trips/${encodeURIComponent(tripId)}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
}