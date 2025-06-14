import { getApi, postApi } from "./utils/apiClient";

export async function getGroups({ status, page = 0, pageSize = 10 }) {
  const path = `/groups/filter?page=${page}&pageSize=${pageSize}&status=${status}`;
  return await getApi(path, "Nieudane pobieranie grup");
}

export async function addGroup(groupData) {
  return await postApi("/groups", groupData, "Nieudane dodanie grupy");
}

export async function getGroupById(groupId) {
  const path = `/groups/${groupId}`;
  return await getApi(path, "Nieudane pobieranie grupy");
}
