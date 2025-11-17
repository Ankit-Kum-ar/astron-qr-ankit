import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Eye } from "lucide-react"
import { QRCode } from "@/lib/models/qrcode"
import { connectDB } from "@/lib/db"
import Image from "next/image"

export default async function AdminPage() {
  // Ensure database connection
  try {
    await connectDB()
  } catch (error) {
    console.error("Database connection error:", error)
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-red-900">Connection Error</h2>
          <p className="mt-2 text-red-600">
            Failed to connect to MongoDB. Please check your MONGODB_URI in .env.local
          </p>
        </div>
      </div>
    )
  }

  // Fetch QR codes from database
  const qrCodes = await QRCode.find().sort({ createdAt: -1 }).limit(10).lean()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">QR Codes Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Manage your dynamic QR codes
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/create">
            <Plus className="w-4 h-4 mr-2" />
            Create QR Code
          </Link>
        </Button>
      </div>

      {/* QR Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All QR Codes</CardTitle>
          <CardDescription>
            {qrCodes.length} QR code{qrCodes.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {qrCodes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No QR codes yet. Create your first one!</p>
              <Button asChild className="mt-4">
                <Link href="/admin/create">Create QR Code</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">QR Preview</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Short Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Short URL</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Destination</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Scans</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {qrCodes.map((qr) => {
                    const id = String(qr._id)
                    const code = String(qr.shortCode)
                    const url = String(qr.shortUrl)
                    const dest = String(qr.destinationUrl)
                    const image = String(qr.qrImageUrl)
                    const scans = Number(qr.scans)
                    const created = new Date(qr.createdAt)

                    return (
                      <tr key={id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200">
                            <Image
                              src={image}
                              alt={`QR ${code}`}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {code}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {url.replace("http://", "")}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={dest}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate max-w-xs"
                            title={dest}
                          >
                            {dest}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {scans}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {created.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                            >
                              <Link href={`/manage/${code}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}