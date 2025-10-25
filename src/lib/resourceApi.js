import { getApi, postApi } from "./utils/apiClient";

export async function getResourcesGroup(groupId) {
  const path = `/groups/${groupId}/cloud-access`;
  return await getApi(path, "Nieudane pobieranie usług");
}

export async function giveCloudResourceAccess(groupId, data) {
  const path = `/groups/${groupId}/cloud-access`;
  return await postApi(path, data, "Nieudane dodawanie usług");
}

export async function getResourceGeneralInfoByGroupId(groupId, resourceId) {
  const path = `/groups/${groupId}/resources/${resourceId}/general-info`; //CHANGE TO CORRECT PATH
  return await getApi(path, "Nieudane pobieranie informacji o zasobie");
}

export async function getResourceEditInfoByGroupId(groupId, resourceId) {
  const path = `/groups/${groupId}/resources/${resourceId}/edit-info`; //CHANGE TO CORRECT PATH
  return await getApi(path, "Nieudane pobieranie informacji o zasobie");
}

export async function updateResourceEditInfoByGroupId(
  groupId,
  resourceId,
  data
) {
  const path = `/groups/${groupId}/resources/${resourceId}/edit-info`; //CHANGE TO CORRECT PATH
  return await patchApi(
    path,
    data,
    "Nieudane aktualizowanie informacji o zasobie"
  );
}

export async function updateResourceGeneralInfoByGroupId(
  groupId,
  resourceId,
  data
) {
  const path = `/groups/${groupId}/resources/${resourceId}/general-info`; //CHANGE TO CORRECT PATH
  return await patchApi(
    path,
    data,
    "Nieudane aktualizowanie informacji o zasobie"
  );
}
