export async function getGroups(activeTab) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";
    const response = await fetch(
      `${baseUrl}/groups/filter?status=${activeTab}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Nieudane pobieranie grup");
    }

    if (data) {
      return data;
    }
    return [];
  } catch (error) {
    throw new Error(error.message || "Błąd połączenia z serwerem");
  }
}

export async function addGroup(groupData) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";
    const response = await fetch(`${baseUrl}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(groupData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.title || "Nieudane dodanie grupy");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
