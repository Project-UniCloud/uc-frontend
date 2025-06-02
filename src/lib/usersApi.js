export async function getUser(userId) {
  try {
    const config = useConfig();
    const response = await fetch(
      `${config.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
      {
        credentials: "include",
      }
    );

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
    const config = useConfig();
    const response = await fetch(
      `${
        config.NEXT_PUBLIC_API_BASE_URL
      }/users/lecturers/search?containsQuery=${encodeURIComponent(query)}`,
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
