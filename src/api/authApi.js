export const loginUser = async ({ username, password }) => {
  try {
    const response = await fetch("http://localhost:8080/users/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Nieprawidłowe dane logowania");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Błąd połączenia z serwerem");
  }
};
