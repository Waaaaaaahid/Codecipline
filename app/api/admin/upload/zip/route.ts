import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/models/Project';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string;

    if (!file || !projectId) {
      return NextResponse.json(
        { success: false, error: 'File and projectId are required' },
        { status: 400 }
      );
    }

    // Only allow ZIP files
    if (!file.name.toLowerCase().endsWith('.zip')) {
      return NextResponse.json(
        { success: false, error: 'Only .zip files are allowed' },
        { status: 400 }
      );
    }

    // Max 500 MB
    const MAX_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File is too large (maximum 500 MB)' },
        { status: 400 }
      );
    }

    // Store in private/zips — NOT in /public, so it is never directly accessible
    const privateDir = path.resolve(process.cwd(), 'private', 'zips');
    if (!fs.existsSync(privateDir)) {
      fs.mkdirSync(privateDir, { recursive: true });
    }

    // Remove old file for this project if it exists
    await connectDB();
    const existing = await ProjectModel.findById(projectId).select('sourceFile').lean();
    if (existing && (existing as any).sourceFile) {
      const oldPath = path.resolve(process.cwd(), 'private', (existing as any).sourceFile);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const filename = `${projectId}-${Date.now()}.zip`;
    const filePath = path.join(privateDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Save only the relative path — never the full server path
    const relativePath = `zips/${filename}`;
    await ProjectModel.findByIdAndUpdate(projectId, { sourceFile: relativePath });

    return NextResponse.json({ success: true, data: { path: relativePath } });
  } catch (error) {
    console.error('[POST /api/admin/upload/zip]', error);
    return NextResponse.json(
      { success: false, error: 'File upload failed' },
      { status: 500 }
    );
  }
}
