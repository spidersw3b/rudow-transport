import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * Must pass the same `secret` and `pages` as NextAuth or middleware cannot decode
 * the session token and will treat unauthenticated users incorrectly. Missing
 * `NEXTAUTH_SECRET` triggers a Configuration error (see NO_SECRET in next-auth).
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin")) {
      if (token?.role !== "admin") {
        const url = new URL("/manage/login", req.url);
        url.searchParams.set("callbackUrl", path);
        url.searchParams.set("error", "AdminOnly");
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    secret: authOptions.secret,
    pages: {
      signIn: "/manage/login",
      error: "/manage/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path === "/manage/login" || path === "/manage/signup") {
          return true;
        }
        if (path.startsWith("/manage") || path.startsWith("/admin")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/manage",
    // All /manage/* except login & signup (so public auth pages skip JWT / NO_SECRET edge)
    "/manage/((?!login|signup).*)",
  ],
};
