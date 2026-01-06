import {getApi, patchApi, postApi} from "../utils/apiClient";

export async function getLecturers({ searchQuery, page = 0, pageSize = 10 }) {
  const path = `/users/lecturers?pageNumber=${page}&pageSize=${pageSize}${
    searchQuery ? `&lecturerFirstOrLastName=${searchQuery}` : ""
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

export async function updateLecturer(lecturerId, lecturerData) {
  return await patchApi(
    `/users/${lecturerId}`,
    lecturerData,
    "Nieudane zaktualizowanie prowadzącego"
  );
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
