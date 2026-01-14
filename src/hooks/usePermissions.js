"use client";
import { useSelector } from "react-redux";
import { hasAccess } from "@/lib/utils/permissions";

export const usePermissions = (initialRoleFromProp) => {
  const user = useSelector((state) => state.auth.user);

  let rawRoles = initialRoleFromProp || user?.roles?.[0] || "";

  const userRoles = rawRoles.includes("-")
    ? rawRoles.split("-")
    : rawRoles
    ? [rawRoles]
    : [];

  const checkAccess = (allowedRoles) => {
    if (userRoles.length === 0) return false;
    return hasAccess(userRoles, allowedRoles);
  };

  return {
    userRoles,
    user,
    checkAccess,
    isAdmin: userRoles.includes("ADMIN"),
    isStudent: userRoles.includes("STUDENT"),
    isLecturer: userRoles.includes("LECTURER"),
  };
};
