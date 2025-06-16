import { getApi } from "./utils/apiClient";

<<<<<<< HEAD
export async function getCloudAccesses({ page = 0, pageSize = 10 }) {
  const path = `/cloud/client?page=${page}&pageSize=${pageSize}`;
=======
export async function getCloudAccesses() {
  const path = `/cloud`;
>>>>>>> origin/develop
  return await getApi(path, "Nieudane pobranie sterowników");
}

export async function getCloudResourcesTypes(client) {
<<<<<<< HEAD
  const path = `/cloud/client/${client}/resource-types`;
  return await getApi(path, "Nieudane pobranie usług dla sterownika");
}

export async function getCloudAccessesById(id) {
  const path = `/cloud/client/${id}`;
  return await getApi(path, "Nieudane pobranie informacji o sterowniku");
}
=======
  const path = `/cloud/${client}`;
  return await getApi(path, "Nieudane pobranie usług dla sterownika");
}
>>>>>>> origin/develop
