import { getApi, postApi } from "./utils/apiClient";

export async function getLecturers(searchQuery) {
  const path = `/users/lecturers${
    searchQuery ? `?lecturerFirstOrLastName=${searchQuery}` : ""
  }`;
  return await getApi(path, "Nieudane pobieranie prowadzących");
}

export async function addLecturer(lecturerData) {
  return await postApi(
    "/users/lecturers",
    lecturerData,
    "Nieudane dodanie prowadzącego"
  );
}

export async function getLecturerById(lecturerId) {
  return await getApi(
    `/users/${lecturerId}`,
    "Nieudane pobieranie prowadzącego"
  );
}

// TODO: Implement these endpoints when backend is ready
export async function updateLecturer(lecturerId, lecturerData) {
  console.log("Update lecturer not implemented yet:", lecturerId, lecturerData);
  return Promise.reject(new Error("Update lecturer not implemented yet"));
}

export async function deleteLecturer(lecturerId) {
  console.log("Delete lecturer not implemented yet:", lecturerId);
  return Promise.reject(new Error("Delete lecturer not implemented yet"));
}

export async function archiveLecturer(lecturerId) {
  const path = `/users/lecturers/${lecturerId}/archive`;
  return await postApi(path, {}, "Nieudane archiwizowanie prowadzącego");
}

export async function activateLecturer(lecturerId) {
  return await postApi(
    `/users/lecturers/${lecturerId}/activate`,
    {},
    "Nieudane aktywowanie prowadzącego"
  );
}

export async function externalSearchLecturers(query) {
  const path = `/users/lecturers/external/search?containsQuery=${encodeURIComponent(
    query
  )}`;
  return await getApi(
    path,
    "Nie udało się pobrać prowadzących z zewnętrznego źródła"
  );
}
