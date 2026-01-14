"use client";
import { createContext, useContext } from "react";

const RolesContext = createContext("");

export function RolesProvider({ children, userRole }) {
  return (
    <RolesContext.Provider value={userRole}>{children}</RolesContext.Provider>
  );
}

export function useRoles() {
  return useContext(RolesContext);
}
