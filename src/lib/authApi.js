export async function loginUser({ login, password }, apiUrl) {
  console.log("Logowanie użytkownika:", login, password);
  try {
    const response = await fetch(`${apiUrl}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Nieprawidłowe dane logowania");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Błąd połączenia z serwerem");
  }
}
