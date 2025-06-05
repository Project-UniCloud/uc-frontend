import { getApi, postApi } from "./utils/apiClient";

export async function getGroups(activeTab) {
  const path = `/groups/filter?status=${activeTab}`;
  return await getApi(path, "Nieudane pobieranie grup");
}

export async function addGroup(groupData) {
  return await postApi("/groups", groupData, "Nieudane dodanie grupy");
}

export async function getGroupById(groupId) {
  const path = `/groups/${groupId}`;
  return await getApi(path, "Nieudane pobieranie grupy");
}
