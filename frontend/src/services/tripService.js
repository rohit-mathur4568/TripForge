const API_BASE_URL = "http://127.0.0.1:8000";

function getAccessToken() {
  return localStorage.getItem("tripforge_access_token") || localStorage.getItem("tf_token");
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
    localStorage.removeItem("tf_token");
    localStorage.removeItem("tf_user");

    // Don't force redirect here since we use a modal on the home page,
    // let AuthContext handle the unauthenticated state.
    // Throwing an error will be caught by the components.
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
    headers: getRequestHeaders(true),
  });
  return handleResponse(response);
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