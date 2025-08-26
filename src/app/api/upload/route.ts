import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Unique filename oluştur
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const path = join(process.cwd(), 'public/uploads', filename)

    await writeFile(path, buffer)

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filename: filename,
      path: `/uploads/${filename}`,
      url: `/uploads/${filename}`
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
