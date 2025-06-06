import { getApi, postApi } from "./utils/apiClient";

export async function getStudentsFromGroup(groupId) {
  const path = `/groups/${groupId}/students`;
  return await getApi(path, "Nieudane pobieranie studentów");
}

export async function addStudentToGroup(groupId, studentData) {
  const path = `/groups/${groupId}/attenders`;
  return await postApi(
    path,
    studentData,
    "Nieudane dodawanie studenta do grupy"
  );
}

export async function addStudentsToGroup(groupId, file) {
  let errorText = "Nieudane dodanie studentów z pliku";
  const form = new FormData();
  form.append("file", file);
  try {
    const response = await fetch(`/groups/${groupId}/attenders/import`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();

        errorText = errorData.detail || errorText;
      } catch {}
      throw new Error(errorText);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
