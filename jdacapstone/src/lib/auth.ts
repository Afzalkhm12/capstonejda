import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from '@/auth.config'; 

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, 
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const { email, password } = credentials;

        const admin = await prisma.admin.findUnique({ where: { email: email as string } });
        if (admin) {
          const isPasswordCorrect = await bcrypt.compare(password as string, admin.password);
          if (isPasswordCorrect) {
            return { id: admin.id, email: admin.email, name: admin.name, role: 'admin' };
          }
        }

        const user = await prisma.user.findUnique({ where: { email: email as string } });
        if (user && user.password) {
          if (!user.emailVerified) {
            throw new Error("Akun Anda belum diverifikasi. Silakan cek email Anda.");
          }
          const isPasswordCorrect = await bcrypt.compare(password as string, user.password);
          if (isPasswordCorrect) {
            return { id: user.id, email: user.email, name: user.name, role: 'user' };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});