import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SignIn from "@/components/sign-in"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Sign In</CardTitle>
          <CardDescription>
            Sign in with your Google account to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn />
        </CardContent>
      </Card>
    </div>
  )
}
