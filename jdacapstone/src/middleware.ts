import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
  const isProtectedUserRoute = 
    nextUrl.pathname.startsWith('/profile') ||
    nextUrl.pathname.startsWith('/my-donations') ||
    nextUrl.pathname.startsWith('/donate');
  
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  
  // Jika admin sudah login dan mencoba mengakses halaman login/register, arahkan ke dashboard
  if (isLoggedIn && userRole === 'admin' && isAuthRoute) {
    return Response.redirect(new URL('/admin/dashboard', nextUrl));
  }
  
  // Jika pengguna biasa sudah login dan mencoba mengakses halaman login/register, arahkan ke halaman utama
  if (isLoggedIn && userRole !== 'admin' && isAuthRoute) {
    return Response.redirect(new URL('/', nextUrl));
  }

  // Jika mencoba mengakses rute admin tanpa hak akses, arahkan ke halaman utama
  if (isAdminRoute && (!isLoggedIn || userRole !== 'admin')) {
    return Response.redirect(new URL('/', nextUrl));
  }
  
  // Jika mencoba mengakses rute pengguna yang dilindungi tanpa login, arahkan ke halaman login
  if (isProtectedUserRoute && !isLoggedIn) {
     const loginUrl = new URL("/login", nextUrl.origin);
     loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
     return Response.redirect(loginUrl);
  }

  // Izinkan semua permintaan lainnya
  return;
});

export const config = {
  matcher: [
    "/profile",
    "/my-donations",
    "/donate",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};