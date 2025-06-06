import { getApi, postApi } from "./utils/apiClient";

export async function getResourcesGroup(groupId) {
  const path = `/groups/${groupId}/cloud-access`;
  return await getApi(path, "Nieudane pobieranie usług");
}

export async function giveCloudResourceAccess(groupId, data) {
  const path = `/groups/${groupId}/cloud-access`;
  console.log("giveCloudResourceAccess", data);
  return await postApi(path, data, "Nieudane dodawanie usług");
}
