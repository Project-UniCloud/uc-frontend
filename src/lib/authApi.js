export async function loginUser({ login, password }) {
  console.log("Logowanie użytkownika:", login, password);
  try {
    const isLocalhost = window.location.hostname === "localhost";
    const baseUrl = isLocalhost ? "http://localhost:8080" : "";
    const apiUrl = `${baseUrl}/api/auth`;
    
    const response = await fetch(apiUrl, {
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
