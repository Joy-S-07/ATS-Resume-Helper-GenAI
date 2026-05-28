import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/signup", "/forgot-password", "/reset-password"];

const PROTECTED_PAGES = [
  "/dashboard",
  "/ats-checker",
  "/resume-builder",
  "/interview",
  "/roadmaps",
];

/**
 * Lightweight edge middleware for route protection.
 * - Checks for the presence of a `token` cookie (set by the Express backend).
 * - Does NOT verify the JWT — the server handles full verification on API calls.
 * - Redirects unauthenticated users away from protected routes.
 * - Redirects authenticated users away from auth pages (login/signup).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p));

  // If the user is logged in and tries to visit auth pages, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is NOT logged in and tries to visit protected pages, redirect to login
  if (!token && isProtectedPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/dashboard/:path*",
    "/ats-checker/:path*",
    "/resume-builder/:path*",
    "/interview/:path*",
    "/roadmaps/:path*",
  ],
};
