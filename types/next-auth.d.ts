declare module "next-auth" {
  interface User {
    isAdmin?: boolean
  }

  interface Session {
    user: {
      email?: string
      isAdmin?: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string
    isAdmin?: boolean
  }
}
