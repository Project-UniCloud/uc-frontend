import { getApi } from "./utils/apiClient";

export async function getCloudAccesses({ page = 0, pageSize = 10 }) {
  const path = `/cloud/client?page=${page}&pageSize=${pageSize}`;
  return await getApi(path, "Nieudane pobranie sterowników");
}

export async function getCloudResourcesTypes(client) {
  const path = `/cloud/client/${client}/resource-types`;
  return await getApi(path, "Nieudane pobranie usług dla sterownika");
}

export async function getCloudAccessesById(id) {
  const path = `/cloud/client/${id}`;
  return await getApi(path, "Nieudane pobranie informacji o sterowniku");
}
