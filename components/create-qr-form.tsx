"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2, Copy } from "lucide-react"
import Image from "next/image"

interface QRResult {
  shortCode: string
  shortUrl: string
  destinationUrl: string
  qrImageUrl: string
}

export function CreateQRForm() {
  const [destinationUrl, setDestinationUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<QRResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResult(null)
    setLoading(true)

    try {
      // Validate URL format
      try {
        new URL(destinationUrl)
      } catch {
        throw new Error("Please enter a valid URL (e.g., https://example.com)")
      }

      const response = await fetch("/api/qr/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinationUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create QR code")
      }

      setResult(data.data)
      setDestinationUrl("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create Dynamic QR Code</CardTitle>
          <CardDescription>
            Enter a destination URL to generate a QR code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The URL that the QR code will redirect to
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !destinationUrl.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate QR Code"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-900">QR Code Created Successfully</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Image */}
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <Image
                  src={result.qrImageUrl}
                  alt="Generated QR Code"
                  width={300}
                  height={300}
                  priority
                  className="w-72 h-72"
                />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Short Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Code
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono">
                    {result.shortCode}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.shortCode)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Short URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short URL
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono truncate">
                    {result.shortUrl}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.shortUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Destination URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination URL
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono truncate">
                  {result.destinationUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.destinationUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* QR Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QR Image URL (MongoDB)
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono truncate">
                  data:image/png;base64... (stored in MongoDB)
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.qrImageUrl.substring(0, 50) + "...")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {copied && (
              <p className="text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Copied to clipboard!
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                asChild
                variant="outline"
                className="flex-1"
              >
                <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                  Test Short URL
                </a>
              </Button>
              <Button
                onClick={() => setResult(null)}
                className="flex-1"
              >
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
