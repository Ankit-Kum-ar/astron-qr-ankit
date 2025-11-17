"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2, Copy, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface QRData {
  _id: string
  shortCode: string
  shortUrl: string
  destinationUrl: string
  qrImageUrl: string
  scans: number
  createdAt: string
  updatedAt: string
}

export default function ManagePage() {
  const params = useParams()
  const code = params.code as string

  const [qrData, setQrData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [destinationUrl, setDestinationUrl] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copied, setCopied] = useState(false)

  // Fetch QR code data
  useEffect(() => {
    fetchQRCode()
  }, [code])

  const fetchQRCode = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`/api/links/${code}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch QR code")
      }

      setQrData(data.data)
      setDestinationUrl(data.data.destinationUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setUpdating(true)

    try {
      // Validate URL
      try {
        new URL(destinationUrl)
      } catch {
        throw new Error("Please enter a valid URL")
      }

      const response = await fetch(`/api/links/${code}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update QR code")
      }

      setQrData(data.data)
      setSuccess("QR code updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setUpdating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!qrData) {
    return (
      <div className="space-y-6">
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">QR Code Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">The QR code with code "{code}" does not exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button asChild variant="outline">
        <Link href="/admin">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Manage QR Code</h2>
        <p className="mt-2 text-gray-600">
          Update the destination URL for QR code <code className="bg-gray-100 px-2 py-1 rounded">{code}</code>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Image Preview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>QR Preview</CardTitle>
            <CardDescription>Current QR code image</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
              <Image
                src={qrData.qrImageUrl}
                alt="QR Code"
                width={200}
                height={200}
                className="w-48 h-48"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              This QR image will NOT change when you update the destination URL
            </p>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>QR Code Details</CardTitle>
            <CardDescription>View and update QR code information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Short Code (Read Only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={qrData.shortCode}
                  readOnly
                  placeholder="Short code"
                  className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(qrData.shortCode)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Short URL (Read Only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={qrData.shortUrl}
                  readOnly
                  placeholder="Short URL"
                  className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-mono truncate"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(qrData.shortUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Destination URL (Editable) */}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination URL <span className="text-red-600">*</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  disabled={updating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Update where this QR code redirects to
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {/* Update Button */}
              <Button type="submit" disabled={updating} className="w-full">
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Destination URL"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">{qrData.scans}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm font-mono text-gray-700">
                {new Date(qrData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-sm font-mono text-gray-700">
                {new Date(qrData.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Scanned</p>
              <p className="text-sm font-mono text-gray-700">
                {qrData.updatedAt ? new Date(qrData.updatedAt).toLocaleDateString() : "Never"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
