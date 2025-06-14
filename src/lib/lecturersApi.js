import { getApi, postApi, patchApi, deleteApi } from "./utils/apiClient";

export async function getLecturers(status = "ACTIVE") {
  const path = `/users/lecturers?status=${status}`;
  return await getApi(path, "Nieudane pobieranie prowadzących");
}

export async function getLecturerById(lecturerId) {
  const path = `/users/lecturers/${lecturerId}`;
  return await getApi(path, "Nieudane pobieranie prowadzącego");
}

export async function addLecturer(lecturerData) {
  return await postApi("/users/lecturers", lecturerData, "Nieudane dodanie prowadzącego");
}

export async function updateLecturer(lecturerId, lecturerData) {
  const path = `/users/lecturers/${lecturerId}`;
  return await patchApi(path, lecturerData, "Nieudane aktualizowanie prowadzącego");
}

export async function deleteLecturer(lecturerId) {
  const path = `/users/lecturers/${lecturerId}`;
  return await deleteApi(path, "Nieudane usunięcie prowadzącego");
}

export async function archiveLecturer(lecturerId) {
  const path = `/users/lecturers/${lecturerId}/archive`;
  return await postApi(path, {}, "Nieudane archiwizowanie prowadzącego");
}

export async function activateLecturer(lecturerId) {
  const path = `/users/lecturers/${lecturerId}/activate`;
  return await postApi(path, {}, "Nieudane aktywowanie prowadzącego");
} 