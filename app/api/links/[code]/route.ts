import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { isAdmin } from "@/lib/admin"
import { QRCode } from "@/lib/models/qrcode"
import { isValidUrl } from "@/lib/qr-utils"
import { connectDB } from "@/lib/db"

/**
 * GET /api/links/[code]
 * Fetch a specific QR code
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Ensure database connection
    await connectDB()

    // Await params - required in Next.js 16
    const { code } = await params

    // Verify authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify admin access
    if (!isAdmin(session.user?.email)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      )
    }

    // Find QR code
    const qrCode = await QRCode.findOne({ shortCode: code })

    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: "QR code not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: qrCode._id,
          shortCode: qrCode.shortCode,
          shortUrl: qrCode.shortUrl,
          destinationUrl: qrCode.destinationUrl,
          qrImageUrl: qrCode.qrImageUrl,
          scans: qrCode.scans,
          lastScannedAt: qrCode.lastScannedAt,
          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Fetch QR code error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/links/[code]
 * Update a specific QR code (destination URL only)
 * QR image remains unchanged
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Ensure database connection
    await connectDB()

    // Await params - required in Next.js 16
    const { code } = await params

    // Verify authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify admin access
    if (!isAdmin(session.user?.email)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { destinationUrl } = body

    // Validate input
    if (!destinationUrl) {
      return NextResponse.json(
        { success: false, error: "destinationUrl is required" },
        { status: 400 }
      )
    }

    if (!isValidUrl(destinationUrl)) {
      return NextResponse.json(
        { success: false, error: "Invalid destination URL" },
        { status: 400 }
      )
    }

    // Find and update QR code
    const qrCode = await QRCode.findOneAndUpdate(
      { shortCode: code },
      {
        destinationUrl,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: "QR code not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "QR code updated successfully",
        data: {
          _id: qrCode._id,
          shortCode: qrCode.shortCode,
          shortUrl: qrCode.shortUrl,
          destinationUrl: qrCode.destinationUrl,
          qrImageUrl: qrCode.qrImageUrl,
          scans: qrCode.scans,
          lastScannedAt: qrCode.lastScannedAt,
          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update QR code error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
