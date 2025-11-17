"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/admin",
      })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSignIn()
      }}
      className="space-y-4"
    >
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
    </form>
  )
} 