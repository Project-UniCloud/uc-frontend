export function getBaseApiUrl() {
  if (typeof window !== "undefined") {
    return window.location.hostname === "unicloud.projektstudencki.pl"
      ? "https://unicloud.projektstudencki.pl/api"
      : "http://localhost:8080/api";
  }

  return "https://unicloud.projektstudencki.pl/api";
}
