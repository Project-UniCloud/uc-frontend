import { getApi } from "./utils/apiClient";

export async function getDrivers() {
  const path = `/drivers`;
  return await getApi(path, "Nieudane pobranie sterowników");
}
