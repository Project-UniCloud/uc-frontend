import { getApi } from "../utils/apiClient";

export async function getLogs({ page = 0, pageSize = 10 }) {
  const path = `/audit-logs?page=${page}&pageSize=${pageSize}`;
  return await getApi(path, "Nieudane pobieranie logów");
}
