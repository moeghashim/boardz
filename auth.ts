import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Resend from "next-auth/providers/resend"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: process.env.EMAIL_FROM!,
      apiKey: process.env.AUTH_RESEND_KEY!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async signIn() {
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/invite/accept")) {
        return url.startsWith("/") ? `${baseUrl}${url}` : url
      }
      if (url.startsWith("/")) return `${baseUrl}/dashboard`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
})
