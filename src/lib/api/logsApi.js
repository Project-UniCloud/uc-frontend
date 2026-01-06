import { getApi } from "../utils/apiClient";

export async function getLogs({ page = 0, pageSize = 10 }) {
  const path = `/logs?pageNumber=${page}&pageSize=${pageSize}`;
  return await getApi(path, "Nieudane pobieranie logów"); // CHANGE TO CORRECT
}
