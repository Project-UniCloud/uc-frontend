import { getApi } from "./utils/apiClient";

export async function getCloudAccesses() {
  const path = `/cloud`;
  return await getApi(path, "Nieudane pobranie sterowników");
}

export async function getCloudResourcesTypes(client) {
  const path = `/cloud/${client}`;
  return await getApi(path, "Nieudane pobranie usług dla sterownika");
}
