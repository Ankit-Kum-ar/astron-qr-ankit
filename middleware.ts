/**
 * Middleware to protect admin routes
 * Routes requiring admin access are protected via layouts instead
 * This middleware serves as a fallback for any request monitoring
 */
export async function middleware() {
  // Routes are protected by layouts, this is a placeholder for future enhancements
}

export const config = {
  matcher: ["/admin/:path*", "/manage/:path*"],
}
