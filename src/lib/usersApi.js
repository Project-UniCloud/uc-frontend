import { getApi } from "./utils/apiClient";

export async function getUser(userId) {
  const path = `/users/${userId}`;
  return await getApi(path, "Nieudane pobieranie użytkownika");
}

export async function searchLecturers(query) {
  const path = `/users/lecturers/search?containsQuery=${encodeURIComponent(
    query
  )}`;
  return await getApi(path, "Nie udało się pobrać prowadzących");
}
