import { getApi } from "./utils/apiClient";

export async function getOverallStats() {
  const path = `/statistics/costs/overall`;
  return await getApi(path, "Nieudane pobieranie ogólnych statystyk");
}

export async function getCostPerGroup() {
  const path = `/statistics/costs/per-group`;
  return await getApi(path, "Nieudane pobieranie kosztów per grupa");
}

export async function getCostPerResourceType() {
  const path = `/statistics/costs/per-resources-type`;
  return await getApi(path, "Nieudane pobieranie kosztów per typ zasobu");
}

export async function getCostInTime() {
  const path = `/statistics/costs/in-time`;
  return await getApi(path, "Nieudane pobieranie kosztów w czasie");
}
