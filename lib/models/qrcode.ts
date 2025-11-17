import mongoose from "mongoose"
import { connectDB } from "@/lib/db"

// Ensure database connection before accessing models
connectDB().catch((error) => {
  console.error("Failed to connect to database:", error)
})

const QRCodeSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    destinationUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => {
          try {
            new URL(v)
            return true
          } catch {
            return false
          }
        },
        message: "Invalid URL",
      },
    },
    qrImageBase64: {
      type: String,
      required: true,
    },
    qrImageUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    scans: {
      type: Number,
      default: 0,
    },
    lastScannedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model recompilation in Next.js dev mode
export const QRCode =
  mongoose.models.QRCode || mongoose.model("QRCode", QRCodeSchema)
