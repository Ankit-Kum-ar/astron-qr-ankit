"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Settings } from "lucide-react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [qr, setQr] = useState("");

  // Generate QR
  const generateQR = async () => {
    if (!input.trim()) return;

    const dataUrl = await QRCode.toDataURL(input, {
      width: 400,
      margin: 2,
    });

    setQr(dataUrl);
  };

  // Download QR
  const downloadQR = () => {
    if (!qr) return;

    const a = document.createElement("a");
    a.href = qr;
    a.download = "qr.png";
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-center flex-1">Free QR Code Generator</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <Settings className="w-4 h-4 mr-2" />
            Admin Panel
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <CardHeader>
          <p className="text-lg font-medium">Enter text or URL</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter any text or URL..."
            className="min-h-[100px]"
          />

          <div className="flex gap-3">
            <Button onClick={generateQR}>Generate QR</Button>
            <Button variant="outline" onClick={downloadQR} disabled={!qr}>
              Download PNG
            </Button>
          </div>

          {qr && (
            <div className="flex justify-center mt-6">
              <Image src={qr} alt="QR Code" width={256} height={256} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
