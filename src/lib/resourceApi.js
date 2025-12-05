import {
  getApi,
  postApi,
  patchApi,
  putApi,
  deleteApi,
} from "./utils/apiClient";

export async function getResourcesGroup(groupId) {
  const path = `/groups/${groupId}/cloud-access`;
  return await getApi(path, "Nieudane pobieranie usług");
}

export async function giveCloudResourceAccess(groupId, data) {
  const path = `/groups/${groupId}/cloud-access`;
  return await postApi(path, data, "Nieudane dodawanie usług");
}

export async function getResourceGeneralInfoByGroupId(groupId, resourceId) {
  const path = `/groups/${groupId}/cloud-access/${resourceId}`; //CHANGE TO CORRECT PATH
  return await getApi(path, "Nieudane pobieranie informacji o zasobie");
}

export async function getResourceEditInfoByGroupId(groupId, resourceId) {
  const path = `/groups/${groupId}/cloud-access/${resourceId}`; //CHANGE TO CORRECT PATH
  return await getApi(path, "Nieudane pobieranie informacji o zasobie");
}

export async function updateResourceEditInfoByGroupId(groupId, data) {
  const path = `/groups/${groupId}/cloud-access`; //CHANGE TO CORRECT PATH
  return await putApi(
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

// TODO CHANGE TO CORRECT PATHS AND NAMES
export async function deactivationResource(groupId, resourceId) {
  console.log("Deactivating resource:", groupId, resourceId);
  return await postApi(
    `/groups/${groupId}/cloud-access/${resourceId}/deactivate`,
    "Nieudane dezaktywowanie zasobu"
  );
}

export async function activationResource(groupId, resourceId) {
  return await postApi(
    `/groups/${groupId}/resources/${resourceId}/activate`,
    "Nieudane aktywowanie zasobu"
  );
}
export async function deleteResource(groupId, resourceId) {
  return await postApi(
    `/groups/${groupId}/resources/${resourceId}/delete`,
    "Nieudane usuwanie zasobu"
  );
}

export async function addResourceType(data) {
    const { cloudConnectorId, resourceType } = data || {};
    const path = `/cloud/connector/${cloudConnectorId}/resource-type`;
    return await postApi(
        path,
        { resourceType },
        "Nieudane dodanie typu zasobu"
    );
}

export async function deleteResourceType(data) {
    const { cloudConnectorId, resourceType } = data || {};
    const path = `/cloud/connector/${cloudConnectorId}/resource-type/${resourceType}`;
    return await deleteApi(path, null, "Nieudane usunięcie typu zasobu");
}
