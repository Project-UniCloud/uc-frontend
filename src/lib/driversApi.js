import { getApi, postApi, putApi } from "./utils/apiClient";

export async function getDrivers({ page = 0, pageSize = 10 }) {
  const path = `/cloud/connector?pageNumber=${page}&pageSize=${pageSize}`;
  return await getApi(path, "Nieudane pobieranie sterowników");
}

export async function addDriver(driverData) {
  return await postApi(
    "/cloud/connector",
    driverData,
    "Nieudane dodanie sterownika"
  );
}

updateDriver;

export async function updateDriver(driverName, driverData) {
  const path = `/cloud/connector/${driverName}`;
  return await putApi(path, driverData, "Nieudane zaktualizowanie sterownika");
}
