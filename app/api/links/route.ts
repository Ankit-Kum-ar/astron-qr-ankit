import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { isAdmin } from "@/lib/admin"
import { QRCode } from "@/lib/models/qrcode"
import { generateQRCodePNG } from "@/lib/qr-generator"
import { uploadQRCodeToS3 } from "@/lib/s3-upload"
import { generateShortCode, buildShortUrl, isValidUrl } from "@/lib/qr-utils"
import { connectDB } from "@/lib/db"

/**
 * POST /api/links
 * Create a new dynamic QR code
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await connectDB()

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

    // Generate short code
    const shortCode = generateShortCode()
    const shortUrl = buildShortUrl(shortCode)

    // Check if short code already exists (extremely rare with nanoid)
    const existingQR = await QRCode.findOne({ shortCode })
    if (existingQR) {
      // Retry with new short code
      const newShortCode = generateShortCode()
      const newShortUrl = buildShortUrl(newShortCode)
      return await generateAndSaveQR(newShortCode, newShortUrl, destinationUrl)
    }

    // Generate and save QR code
    return await generateAndSaveQR(shortCode, shortUrl, destinationUrl)
  } catch (error) {
    console.error("QR creation error:", error)
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
 * GET /api/links
 * List all QR codes (admin only, with pagination)
 */
export async function GET(request: NextRequest) {
  try {
    // Ensure database connection
    await connectDB()

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

    // Get pagination parameters from query
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Fetch QR codes with pagination
    const qrCodes = await QRCode.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count
    const total = await QRCode.countDocuments()

    return NextResponse.json(
      {
        success: true,
        data: qrCodes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Fetch QR codes error:", error)
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
 * Helper function to generate QR and save to database
 */
async function generateAndSaveQR(
  shortCode: string,
  shortUrl: string,
  destinationUrl: string
) {
  try {
    // Generate QR code as PNG buffer
    const qrBuffer = await generateQRCodePNG(shortUrl)

    // Upload to MongoDB (with mock S3 URL format)
    const fileName = `${shortCode}-${Date.now()}.png`
    const { url: qrImageUrl, base64: qrImageBase64 } = await uploadQRCodeToS3(
      qrBuffer,
      fileName
    )

    // Save to MongoDB with base64 image data
    const qrCode = new QRCode({
      shortCode,
      shortUrl,
      destinationUrl,
      qrImageUrl,
      qrImageBase64,
    })

    await qrCode.save()

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
          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error generating and saving QR:", error)
    throw error
  }
}
