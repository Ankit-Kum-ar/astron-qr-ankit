import QRCode from "qrcode"

/**
 * Generate QR code as PNG buffer
 */
export async function generateQRCodePNG(text: string): Promise<Buffer> {
  try {
    return await new Promise((resolve, reject) => {
      QRCode.toBuffer(
        text,
        {
          errorCorrectionLevel: "H",
          type: "png",
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (err, buffer) => {
          if (err) reject(err)
          else resolve(buffer)
        }
      )
    })
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`)
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(text: string): Promise<string> {
  try {
    return await new Promise((resolve, reject) => {
      QRCode.toString(
        text,
        {
          errorCorrectionLevel: "H",
          type: "svg",
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (err, string) => {
          if (err) reject(err)
          else resolve(string)
        }
      )
    })
  } catch (error) {
    throw new Error(`Failed to generate QR code SVG: ${error}`)
  }
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCodeDataURL(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
  } catch (error) {
    throw new Error(`Failed to generate QR code data URL: ${error}`)
  }
}
