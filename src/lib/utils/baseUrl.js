const baseApiUrl =
  window.location.hostname === "unicloud.projektstudencki.pl"
    ? "https://unicloud.projektstudencki.pl/api"
    : "http://localhost:8080/api";

export default baseApiUrl;
