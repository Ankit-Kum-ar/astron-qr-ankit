import { CreateQRForm } from "@/components/create-qr-form"

export default function CreateQRPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Create QR Code</h2>
        <p className="mt-2 text-gray-600">
          Generate a new dynamic QR code that redirects to your URL
        </p>
      </div>

      <CreateQRForm />
    </div>
  )
}
