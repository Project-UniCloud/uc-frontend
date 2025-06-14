import { getApi, postApi } from "./utils/apiClient";
import baseApiUrl from "@/lib/utils/baseUrl";

export async function getStudentsFromGroup({
  groupId,
  page = 0,
  pageSize = 10,
}) {
  const path = `/groups/${groupId}/students?page=${page}&pageSize=${pageSize}`;
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

// export async function addStudentsToGroup(groupId, file) {
//   const path = `/groups/${groupId}/attenders/import`;
//   return await postApi(path, file, "Nieudane dodanie studentów z pliku");
// }

export async function addStudentsToGroup(groupId, file) {
  const url = `${baseApiUrl}/groups/${groupId}/attenders/import`;
  const form = new FormData();
  form.append("file", file);

  console.log("Adding students to group", groupId, file);

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: form,
  });

  if (!res.ok) {
    let msg = "Nieudane dodanie studentów z pliku";
    try {
      const err = await res.json();
      msg = err.detail || msg;
    } catch {}
    throw new Error(msg);
  }
}
