export async function getUser(userId, apiUrl) {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
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

export async function searchLecturers(query, apiUrl) {
  try {
    const response = await fetch(
      `${apiUrl}/users/lecturers/search?containsQuery=${encodeURIComponent(
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
