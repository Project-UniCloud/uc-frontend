export function getCookie(name) {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop().split(";").shift();
    return cookieValue;
  }

  return null;
}

export function getRolesFromCookie() {
  const rolesStr = getCookie("roles");

  if (!rolesStr) return [];

  const roles = rolesStr.includes("-") ? rolesStr.split("-") : [rolesStr];
  return roles;
}
