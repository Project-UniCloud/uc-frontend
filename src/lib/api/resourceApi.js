import {
  getApi,
  postApi,
  patchApi,
  putApi,
  deleteApi,
} from "../utils/apiClient";

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
  return await deleteApi(
    `/groups/${groupId}/resources/${resourceId}`,
    "Nieudane usuwanie zasobu"
  );
}

export async function addResourceType(data) {
  const { cloudConnectorId, resourceType } = data || {};
  const path = `/cloud/connector/${cloudConnectorId}/resource-type`;
  return await postApi(path, { resourceType }, "Nieudane dodanie typu zasobu");
}

export async function deleteResourceType(data) {
  const { cloudConnectorId, resourceType } = data || {};
  const path = `/cloud/connector/${cloudConnectorId}/resource-type/${resourceType}`;
  return await deleteApi(path, null, "Nieudane usunięcie typu zasobu");
}

export async function getResourcesGroupCloudAccess({
  groupId,
  resourceId,
  page = 0,
  pageSize = 10,
}) {
  const path = `/groups/${groupId}/cloud-access/${resourceId}/resources?page=${page}&size=${pageSize}`;
  return await getApi(path, "Nieudane pobieranie zasobów");
}

export async function deleteResourcesGroupCloudAccess(
  groupId,
  resourceId,
  resourceGlobalId = null
) {
  let path = `/groups/${groupId}/cloud-access/${resourceId}/resources`;
  if (resourceGlobalId) {
    const encoded = encodeURIComponent(resourceGlobalId);
    path += `?resourceGlobalId=${encoded}`;
  }
  return await deleteApi(path, null, "Nieudane usuwanie zasobów");
}
