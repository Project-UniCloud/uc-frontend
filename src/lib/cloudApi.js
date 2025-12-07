import { getApi } from "./utils/apiClient";

export async function getCloudAccesses({ page = 0, pageSize = 10 }) {
  const path = `/cloud/connector?pageNumber=${page}&pageSize=${pageSize}`;
  return await getApi(path, "Nieudane pobranie sterowników");
}

export async function getCloudResourcesTypes(client) {
  const path = `/cloud/connector/${client}/resource-types`;
  return await getApi(path, "Nieudane pobranie usług dla sterownika");
}

export async function getCloudAccessesById(id) {
  const path = `/cloud/connector/${id}`;
  return await getApi(path, "Nieudane pobranie informacji o sterowniku");
}

export async function getResourceTypesByDriverId(driverId) {
  const path = `/cloud/connector/${driverId}/resource-types`;
  return await getApi(path, "Nieudane pobranie typów zasobów dla sterownika");
}
