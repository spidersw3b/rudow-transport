import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

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
  matcher: ["/manage/:path*", "/admin/:path*"],
};
