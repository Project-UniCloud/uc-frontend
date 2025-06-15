import { getApi, postApi, patchApi } from "./utils/apiClient";

export async function getGroups({
  status,
  page = 0,
  pageSize = 10,
  groupName = "",
}) {
  const path = `/groups?page=${page}&pageSize=${pageSize}&status=${status}&groupName=${groupName}`;
  return await getApi(path, "Nieudane pobieranie grup");
}

export async function addGroup(groupData) {
  return await postApi("/groups", groupData, "Nieudane dodanie grupy");
}

export async function getGroupById(groupId) {
  const path = `/groups/${groupId}`;
  return await getApi(path, "Nieudane pobieranie grupy");
}

export async function updateGroup(groupId, groupData) {
  const path = `/groups/${groupId}`;
  return await patchApi(path, groupData, "Nieudane aktualizowanie grupy");
}
