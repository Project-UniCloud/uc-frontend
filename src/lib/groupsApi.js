import { getApi, postApi, patchApi } from "./utils/apiClient";

export async function getGroups({
  status = "",
  page = 0,
  pageSize = 10,
  groupName = "",
  cloudClientId = "",
}) {
  const path = `/groups?page=${page}&pageSize=${pageSize}&status=${status}&groupName=${groupName}&${
    cloudClientId && `cloudClientId=${cloudClientId}`
  }`;
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

export async function archiveGroup(groupId) {
  return await postApi(
    `/groups/${groupId}/archive`,
    "Nieudane zarchiwizowanie grupy"
  );
}

export async function activateGroup(groupId) {
  return await postApi(
    `/groups/${groupId}/activate`,
    "Nieudane aktywowanie grupy"
  );
}
