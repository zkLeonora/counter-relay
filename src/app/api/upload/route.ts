import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'File type must be JPEG, PNG, WEBP, GIF, or SVG' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be under 5MB' }, { status: 400 });
    }

    // Sanitize extension and create unique filename
    const ext = path.extname(file.name) || '.jpg';
    const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // If Vercel Blob token is configured (Vercel production/preview or local env), upload to Vercel Blob CDN
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${filename}`, file, {
        access: 'public',
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // Fallback for local development when BLOB token is not configured
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to upload image' }, { status: 500 });
  }
}

