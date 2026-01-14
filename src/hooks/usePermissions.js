"use client";
import { hasAccess } from "@/lib/utils/permissions";
import { useRoles } from "@/contexts/RolesContext";

export const usePermissions = (rolesFromProp) => {
  const rolesFromContext = useRoles();
  const rolesStr = rolesFromProp || rolesFromContext;

  const userRoles = rolesStr
    ? rolesStr.includes("-")
      ? rolesStr.split("-")
      : [rolesStr]
    : [];

  const checkAccess = (allowedRoles) => {
    if (userRoles.length === 0) return false;
    return hasAccess(userRoles, allowedRoles);
  };

  const permissions = {
    userRoles,
    checkAccess,
    isAdmin: userRoles.includes("ADMIN"),
    isStudent: userRoles.includes("STUDENT"),
    isLecturer: userRoles.includes("LECTURER"),
  };
  return permissions;
};
