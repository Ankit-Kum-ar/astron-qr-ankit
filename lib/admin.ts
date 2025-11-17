/**
 * Admin utilities for role-based access control
 */

/**
 * Get admin emails from environment variable
 * Expects comma-separated email list: admin1@example.com,admin2@example.com
 * If empty, all authenticated users are treated as admins (for development/testing)
 */
export function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS || "";
  return adminEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

/**
 * Check if email belongs to admin list
 * If no admin emails are configured, allow any authenticated user
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const adminEmails = getAdminEmails();
  
  // If no admin emails configured, allow any authenticated user
  if (adminEmails.length === 0) {
    return true;
  }
  
  // Otherwise, check if email is in admin list
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Validate admin access
 * Throws error if user is not admin
 */
export function validateAdminAccess(email: string | null | undefined): void {
  if (!isAdmin(email)) {
    throw new Error("Unauthorized: Admin access required");
  }
}
