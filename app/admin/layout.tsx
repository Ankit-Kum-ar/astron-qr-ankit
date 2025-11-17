import { auth } from "@/auth"
import { validateAdminAccess } from "@/lib/admin"
import { AdminHeader } from "@/components/admin-header"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Redirect to signin if not authenticated
  if (!session) {
    redirect("/auth/signin")
  }

  // Validate admin access
  try {
    validateAdminAccess(session.user?.email)
  } catch {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
