import { nanoid } from "nanoid"

/**
 * Generate short code for QR
 * Format: 6 characters alphanumeric (e.g., ABC123)
 */
export function generateShortCode(): string {
  return nanoid(6).toUpperCase()
}

/**
 * Build short URL for QR code
 */
export function buildShortUrl(shortCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return `${baseUrl}/q/${shortCode}`
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
