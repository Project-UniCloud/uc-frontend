"use client";
import { useSelector } from "react-redux";
import { hasAccess } from "@/lib/utils/permissions";
import { useState, useEffect } from "react";

export const usePermissions = () => {
  const user = useSelector((state) => state.auth.user);
  const reduxRoles = user?.roles || [];
  const [localRoles, setLocalRoles] = useState(() => {
    // LOCAL STORAGE TO CHANGE
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userRoles");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error("Error parsing stored roles:", error);
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userRoles");
      if (stored) {
        try {
          setLocalRoles(JSON.parse(stored));
        } catch (error) {
          console.error("Error parsing stored roles:", error);
        }
      }
    }
  }, []);

  const userRoles = reduxRoles.length > 0 ? reduxRoles : localRoles;

  const checkAccess = (allowedRoles) => {
    return hasAccess(userRoles, allowedRoles);
  };

  return {
    userRoles,
    user,
    checkAccess,
    isAdmin: userRoles?.includes("ADMIN") || false,
    isLecturer: userRoles?.includes("LECTURER") || false,
    isStudent: userRoles?.includes("STUDENT") || false,
  };
};
