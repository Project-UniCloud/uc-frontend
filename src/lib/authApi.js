import { postApi } from "./utils/apiClient";

export async function loginUser({ login, password }) {
  return await postApi(
    "/auth",
    { login, password },
    "Nieprawidłowe dane logowania",
    true
  );
}
