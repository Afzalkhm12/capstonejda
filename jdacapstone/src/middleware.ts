import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isProtectedUserRoute = 
    nextUrl.pathname.startsWith('/profile') ||
    nextUrl.pathname.startsWith('/my-donations') ||
    nextUrl.pathname.startsWith('/donate');
  
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  
  // Jika mencoba mengakses rute admin
  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== 'admin') {
      // Arahkan ke halaman utama jika bukan admin
      return Response.redirect(new URL('/', nextUrl));
    }
    // Jika admin, izinkan akses
    return;
  }
  
  // Jika mencoba mengakses rute pengguna yang dilindungi
  if (isProtectedUserRoute && !isLoggedIn) {
     const loginUrl = new URL("/login", nextUrl.origin);
     loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
     return Response.redirect(loginUrl);
  }

  // Izinkan semua permintaan lainnya
  return;
});

export const config = {
  // Middleware akan berjalan di rute-rute ini
  matcher: [
    "/profile",
    "/my-donations",
    "/donate",
    "/admin/:path*",
  ],
};