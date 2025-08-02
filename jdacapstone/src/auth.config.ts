import type { NextAuthConfig } from 'next-auth';
import { User } from 'next-auth'; 

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isProtectedRoute = 
        isAdminRoute ||
        nextUrl.pathname.startsWith('/profile') ||
        nextUrl.pathname.startsWith('/my-donations') ||
        nextUrl.pathname.startsWith('/donate');

      if (isProtectedRoute) {
        if (!isLoggedIn) return false;
        if (isAdminRoute && userRole !== 'admin') {
          return Response.redirect(new URL('/admin/dashboard', nextUrl));
        }
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;