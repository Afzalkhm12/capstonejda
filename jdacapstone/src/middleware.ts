import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login", // Arahkan pengguna ke halaman login kustom Anda
  },
});

// Konfigurasi ini menentukan halaman mana yang akan dilindungi
export const config = { 
  matcher: [
    "/products",     // <-- DILINDUNGI
    "/profile",      // <-- DILINDUNGI
    "/my-donations", // Melindungi halaman donasi
    "/admin/:path*", // Melindungi semua halaman di bawah /admin
  ] 
};