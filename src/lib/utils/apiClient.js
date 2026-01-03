import { getBaseApiUrl } from "./baseUrl";

const isUnauthorized = (status) => status === 401;

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

async function handleError(response, fallbackText) {
  try {
    const errorData = await response.json();
    return errorData.detail || fallbackText;
  } catch {
    return fallbackText;
  }
}

export async function getApi(path, errorText) {
  try {
    const response = await fetch(`${getBaseApiUrl()}${path}`, {
      credentials: "include",
    });

    if (isUnauthorized(response.status)) {
      redirectToLogin();
      throw new Error("unauthorized");
    }

    if (!response.ok) {
      const message = await handleError(response, errorText);
      throw new Error(message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Błąd połączenia z serwerem");
  }
}

export async function postApi(path, body = null, errorText, data = false) {
  try {
    const response = await fetch(`${getBaseApiUrl()}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (isUnauthorized(response.status)) {
      redirectToLogin();
      throw new Error("unauthorized");
    }

    if (!response.ok) {
      const message = await handleError(response, errorText);
      throw new Error(message);
    }

    if (data) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function patchApi(path, body, errorText, data = false) {
  try {
    const response = await fetch(`${getBaseApiUrl()}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (isUnauthorized(response.status)) {
      redirectToLogin();
      throw new Error("unauthorized");
    }

    if (!response.ok) {
      const message = await handleError(response, errorText);
      throw new Error(message);
    }

    if (data) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function putApi(path, body = null, errorText, data = false) {
  try {
    const response = await fetch(`${getBaseApiUrl()}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (isUnauthorized(response.status)) {
      redirectToLogin();
      throw new Error("unauthorized");
    }

    if (!response.ok) {
      const message = await handleError(response, errorText);
      throw new Error(message);
    }

    if (data) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteApi(path, body = null, errorText, data = false) {
  try {
    const response = await fetch(`${getBaseApiUrl()}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (isUnauthorized(response.status)) {
      redirectToLogin();
      throw new Error("unauthorized");
    }

    if (!response.ok) {
      const message = await handleError(response, errorText);
      throw new Error(message);
    }

    if (data) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
