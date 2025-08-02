import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Logika untuk melindungi rute admin
    if (pathname.startsWith("/admin")) {
      // Jika pengguna tidak login ATAU perannya bukan admin, alihkan
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      // Pengguna harus login (memiliki token) untuk mengakses halaman yang cocok
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Arahkan ke halaman login kustom jika tidak terotentikasi
      signIn: "/login",
    },
  }
);

// Konfigurasi ini menentukan halaman mana yang akan dilindungi
export const config = {
  matcher: [
    "/profile",
    "/my-donations",
    "/admin/:path*", // Melindungi semua rute di bawah /admin
  ],
};