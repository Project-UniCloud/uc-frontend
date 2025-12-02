import { getApi, postApi } from "./utils/apiClient";

export async function getDrivers({ page = 0, pageSize = 10 }) {
  const path = `/cloud/connector?page=${page}&pageSize=${pageSize}`;
  return await getApi(path, "Nieudane pobieranie sterowników");
}

export async function addDriver(driverData) {
  return await postApi(
    "/cloud/connector",
    driverData,
    "Nieudane dodanie sterownika"
  );
}
