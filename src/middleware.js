import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ROUTE_PERMISSIONS, hasAccess } from "@/lib/utils/permissions";

const PUBLIC_PATHS = ["/login", "/_next", "/favicon.ico"];

export function middleware(request) {
  const token = request.cookies.get("jwt")?.value;
  const pathname = request.nextUrl.pathname;
  const userRoleRaw = request.cookies.get("roles")?.value || "";
  const userRolesArray = userRoleRaw.split("-").filter(Boolean);
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const matchedRoute = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const allowedRoles = ROUTE_PERMISSIONS[matchedRoute];
    if (!hasAccess(userRolesArray, allowedRoles)) {
      if (pathname !== "/dashboard") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-role", userRoleRaw);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
