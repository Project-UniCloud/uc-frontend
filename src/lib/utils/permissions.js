export const ROLES = {
  ADMIN: "ADMIN",
  LECTURER: "LECTURER",
  STUDENT: "STUDENT",
};

export const hasAccess = (userRoles, allowedRoles) => {
  if (!userRoles || userRoles.length === 0) return false;
  return userRoles.some((role) => allowedRoles.includes(role));
};

export const PERMISSIONS = {
  DASHBOARD: [ROLES.ADMIN, ROLES.LECTURER],
  GROUPS: [ROLES.ADMIN, ROLES.LECTURER],
  NOTIFICATIONS: [ROLES.ADMIN, ROLES.LECTURER],
  LECTURERS: [ROLES.ADMIN],
  DRIVERS: [ROLES.ADMIN],
};
