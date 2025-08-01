// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

const { handlers } = NextAuth(authConfig);
export const { GET, POST } = handlers;