/**
 * Mock AWS S3 upload - stores QR code as base64 in MongoDB
 * This simulates S3 storage while actually persisting to MongoDB
 */
export async function uploadQRCodeToS3(
  buffer: Buffer,
  fileName: string
): Promise<{ url: string; base64: string }> {
  try {
    // Convert buffer to base64
    const base64 = buffer.toString("base64")
    
    // Mock S3 URL (simulating AWS S3 URL format)
    // In production, this would be the actual S3 CDN URL
    const mockS3Url = `data:image/png;base64,${base64}`
    
    // Log for debugging
    console.log(`✅ Mock S3 Upload: ${fileName} (${buffer.length} bytes stored in MongoDB)`)
    
    return {
      url: mockS3Url,
      base64,
    }
  } catch (error) {
    throw new Error(`Failed to process QR code image: ${error}`)
  }
}

/**
 * Mock delete from S3 - just logs deletion
 */
export async function deleteQRCodeFromS3(fileName: string): Promise<void> {
  try {
    console.log(`✅ Mock S3 Delete: ${fileName} (would be removed from S3)`)
  } catch (error) {
    console.error(`Failed to delete QR code: ${error}`)
  }
}
