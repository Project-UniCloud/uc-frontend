/**
 * Konfiguracja ról i uprawnień w systemie
 */

export const ROLES = {
  ADMIN: "admin",
  LECTURER: "lecturer",
  STUDENT: "student",
};

/**
 * Sprawdza czy użytkownik ma dostęp do danej funkcjonalności
 * @param {string} userRole - Rola użytkownika
 * @param {string[]} allowedRoles - Tablica dozwolonych ról
 * @returns {boolean}
 */
export const hasAccess = (userRole, allowedRoles) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Konfiguracja uprawnień do poszczególnych sekcji
 */
export const PERMISSIONS = {
  DASHBOARD: [ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT],
  GROUPS: [ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT],
  NOTIFICATIONS: [ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT],
  LECTURERS: [ROLES.ADMIN, ROLES.LECTURER],
  DRIVERS: [ROLES.ADMIN],
};
