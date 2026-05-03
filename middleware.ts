import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Do not import `authOptions` here — that pulls bcrypt/Supabase into the Edge
 * middleware bundle and can break sign-in. Pass `secret` / `pages` explicitly
 * (same values as `lib/auth.ts`). Missing `NEXTAUTH_SECRET` → Configuration error.
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
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
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
