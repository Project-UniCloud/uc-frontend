export function getBaseApiUrl() {
  if (typeof window !== "undefined" && window.ENV?.BACKEND_API_URL) {
    return window.ENV.BACKEND_API_URL;
  }

  return "http://localhost:8080/api";
}
