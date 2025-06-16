import { getApi, postApi } from "./utils/apiClient";

export async function getResourcesGroup(groupId) {
  const path = `/groups/${groupId}/cloud-access`;
  return await getApi(path, "Nieudane pobieranie usług");
}

export async function giveCloudResourceAccess(groupId, data) {
  const path = `/groups/${groupId}/cloud-access`;
<<<<<<< HEAD
=======
  console.log("giveCloudResourceAccess", data);
>>>>>>> origin/develop
  return await postApi(path, data, "Nieudane dodawanie usług");
}
