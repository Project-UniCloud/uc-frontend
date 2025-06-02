export async function getUser(userId) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";
    const response = await fetch(`${baseUrl}/users/${userId}`, {
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
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";
    const response = await fetch(
      `${baseUrl}/users/lecturers/search?containsQuery=${encodeURIComponent(
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
