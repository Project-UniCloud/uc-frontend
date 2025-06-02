import baseApiUrl from "./utils/baseUrl";

export async function getUser(userId) {
  try {
    const response = await fetch(`${baseApiUrl}/users/${userId}`, {
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Nieudane pobieranie użytkownika");
    }

    if (data) {
      return data;
    }
    return null;
  } catch (error) {
    throw new Error(error.message || "Błąd połączenia z serwerem");
  }
}

export async function searchLecturers(query) {
  try {
    const response = await fetch(
      `${baseApiUrl}/users/lecturers/search?containsQuery=${encodeURIComponent(
        query
      )}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Nie udało się pobrać prowadzących");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Błąd połączenia z serwerem");
  }
}
