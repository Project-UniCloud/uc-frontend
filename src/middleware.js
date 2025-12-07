import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/_next", "/favicon.ico"];

export function middleware(request) {
  const token = request.cookies.get("jwt")?.value;
  const pathname = request.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if (token && pathname === "/login") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
