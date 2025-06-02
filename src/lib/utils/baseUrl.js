const baseApiUrl =
  process.env.NODE_ENV === "dev"
    ? "https://unicloud.projektstudencki.pl/api"
    : "http://localhost:8080/api";
export default baseApiUrl;
