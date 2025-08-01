import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { token } = request.nextauth;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);
export const config = {
  matcher: [
    "/profile",
    "/my-donations",
    "/admin/:path*",
  ],
};
