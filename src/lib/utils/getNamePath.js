"use client";

import { usePathname } from "next/navigation";

function isDetailsPath(parts, prefix, step) {
  // Sprawdza czy ścieżka to /prefix/:id gdzie :id to UUID v4
  if (parts.length !== step) return false;
  return (
    parts[parts.length - step] === prefix &&
    /^[0-9a-fA-F-]{36}$/.test(parts[parts.length - (step - 1)])
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
    case "profile":
      namePath = "Profil";
      break;
    default:
      if (isDetailsPath(parts, "groups", 2)) {
        namePath = "Informacje o grupie";
      }
      if (isDetailsPath(parts, "groups", 3)) {
        namePath = "Informacje o zasobie";
      }
      if (parts[parts.length - 2] === "drivers") {
        return "Informacje o sterowniku";
      }
      if (isDetailsPath(parts, "list-lecturers", 2)) {
        namePath = "Informacje o prowadzącym";
      }
      break;
  }
  return namePath;
}
