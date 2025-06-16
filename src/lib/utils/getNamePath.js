"use client";

import { usePathname } from "next/navigation";

function isDetailsPath(parts, prefix) {
  // Sprawdza czy ścieżka to /prefix/:id gdzie :id to UUID v4
  return (
    parts.length >= 2 &&
    parts[parts.length - 2] === prefix &&
    /^[0-9a-fA-F-]{36}$/.test(parts[parts.length - 1])
  );
}

export function useNamePath() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let namePath = "";
  const pageName = parts[parts.length - 1];

  switch (pageName) {
    case "dashboard":
      namePath = "Przegląd";
      break;
    case "groups":
      namePath = "Grupy";
      break;
    case "finances":
      namePath = "Finanse";
      break;
    case "notifications":
      namePath = "Powiadomienia";
      break;
    case "list-lecturers":
      namePath = "Prowadzący";
      break;
    case "drivers":
      namePath = "Sterowniki";
      break;
    case "settings":
      namePath = "Ustawienia";
      break;
    case "report-bug":
      namePath = "Zgłoś błąd";
      break;
    case "profile":
      namePath = "Profil";
      break;
    default:
      if (isDetailsPath(parts, "groups")) {
        namePath = "Informacje o grupie";
      }
      if (parts[parts.length - 2] === "drivers") {
        return "Informacje o sterowniku";
      }
      break;
  }
  return namePath;
}
