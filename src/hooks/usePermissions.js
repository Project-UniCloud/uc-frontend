import { useSelector } from "react-redux";
import { hasAccess } from "@/lib/utils/permissions";

export const usePermissions = () => {
  const user = useSelector((state) => state.auth.user);
  const userRoles = user?.roles || [];

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
