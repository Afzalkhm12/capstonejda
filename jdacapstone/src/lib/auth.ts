import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi.");
        }
        
        const { email, password } = credentials;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (admin) {
          const isPasswordCorrect = await bcrypt.compare(password, admin.password);
          if (isPasswordCorrect) {
            return { id: admin.id, email: admin.email, name: admin.name, role: 'admin' };
          }
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          if (!user.password) throw new Error("Kredensial tidak valid.");
          if (!user.emailVerified) throw new Error("Akun Anda belum diverifikasi. Silakan cek email Anda.");
          
          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          if (isPasswordCorrect) {
            return { id: user.id, email: user.email, name: user.name, role: 'user' };
          }
        }

        throw new Error("Kredensial tidak valid.");
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === 'development',
};