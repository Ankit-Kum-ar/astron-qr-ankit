import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { isAdmin } from "@/lib/admin"

const config = {
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    /**
     * JWT callback - add admin role to token
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt({ token, user }: any) {
      if (user?.email) {
        token.email = user.email
        token.isAdmin = isAdmin(user.email)
      }
      return token
    },

    /**
     * Session callback - expose role to session
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session({ session, token }: any) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },

    /**
     * SignIn callback - restrict access to admin emails only
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user }: any) {
      // Only allow admin emails to sign in
      if (!isAdmin(user.email)) {
        return false // Deny sign in
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { handlers, auth, signIn, signOut } = (NextAuth as any)(config)