import { useSelector } from "react-redux";
import { hasAccess } from "@/lib/utils/permissions";

/**
 * Hook do sprawdzania uprawnień użytkownika
 * @returns {Object} Obiekt z danymi i metodami związanymi z uprawnieniami
 */
export const usePermissions = () => {
  const userRole = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);

  /**
   * Sprawdza czy użytkownik ma dostęp do danej funkcjonalności
   * @param {string[]} allowedRoles - Tablica dozwolonych ról
   * @returns {boolean}
   */
  const checkAccess = (allowedRoles) => {
    return hasAccess(userRole, allowedRoles);
  };

  return {
    userRole,
    user,
    checkAccess,
    isAdmin: userRole === "admin",
    isLecturer: userRole === "lecturer",
    isStudent: userRole === "student",
  };
};
