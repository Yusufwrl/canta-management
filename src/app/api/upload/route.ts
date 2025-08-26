import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'

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
    
    // Environment'a göre upload directory belirle
    const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'public/uploads')
    const fullPath = join(uploadDir, filename)
    
    // Klasör yoksa oluştur
    const dirPath = dirname(fullPath)
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
    }

    await writeFile(fullPath, buffer)

    // URL'i environment'a göre ayarla
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `/uploads/${filename}`  // VPS'te nginx uploads klasörünü serve edecek
      : `/uploads/${filename}`  // Local'de public/uploads

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filename: filename,
      path: fullPath,
      url: baseUrl
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
