import { NextRequest, NextResponse } from "next/server"
import { QRCode } from "@/lib/models/qrcode"
import { connectDB } from "@/lib/db"

/**
 * GET /q/[shortCode]
 * Redirect to destination URL based on short code
 * Shows "Not Found" if code doesn't exist
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    // Ensure database connection
    await connectDB()

    // Await params - required in Next.js 16
    const { shortCode } = await params

    // Find QR code by short code
    const qrCode = await QRCode.findOne({ shortCode })

    if (!qrCode) {
      // Return HTML page instead of JSON for browser display
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code Not Found</title>
            <style>
              body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f5f5f5; }
              .container { text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              h1 { color: #d32f2f; margin: 0 0 10px 0; }
              p { color: #666; margin: 0 0 20px 0; }
              code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
              a { color: #1976d2; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>404 - QR Code Not Found</h1>
              <p>The QR code <code>${shortCode}</code> does not exist or has been deleted.</p>
              <p><a href="/">Go back to home</a></p>
            </div>
          </body>
        </html>
        `,
        {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      )
    }

    // Update scan count and last scanned time
    qrCode.scans = (qrCode.scans || 0) + 1
    qrCode.lastScannedAt = new Date()
    await qrCode.save()

    // Redirect to destination URL with 307 (Temporary) instead of 301
    return NextResponse.redirect(qrCode.destinationUrl, {
      status: 307,
    })
  } catch (error) {
    console.error("Redirect error:", error)
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f5f5f5; }
            .container { text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            h1 { color: #d32f2f; margin: 0 0 10px 0; }
            p { color: #666; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>500 - Server Error</h1>
            <p>An error occurred while processing your request.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    )
  }
}
