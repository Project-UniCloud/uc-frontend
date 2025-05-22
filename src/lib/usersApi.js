export async function getUser(userId) {
  try {
    const response = await fetch(`http://localhost:8080/users/${userId}`, {
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
