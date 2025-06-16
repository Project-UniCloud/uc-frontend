import { getBaseApiUrl } from "./baseUrl";

export async function getApi(path, errorText) {
  try {
    const response = await fetch(`${getBaseApiUrl()}${path}`, {
      credentials: "include",
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log(errorData);
        errorText = errorData.detail || errorText;
      } catch {}
      throw new Error(errorText);
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

    if (!response.ok) {
      try {
        const errorData = await response.json();

        errorText = errorData.detail || errorText;
      } catch {}
      throw new Error(errorText);
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

    if (!response.ok) {
      try {
        const errorData = await response.json();
        errorText = errorData.detail || errorText;
      } catch {}
      throw new Error(errorText);
    }

    if (data) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
