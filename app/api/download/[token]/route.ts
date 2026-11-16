import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PurchaseModel } from '@/models/Purchase';
import { ProjectModel } from '@/models/Project';
import path from 'path';
import fs from 'fs';
import { DEMO_SOURCE_FILE, DEMO_ZIP_BASE64 } from '@/lib/demo-project';

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    if (!token || token.length !== 64) {
      return NextResponse.json({ success: false, error: 'Invalid download token' }, { status: 400 });
    }

    await connectDB();

    // Find purchase by token
    const purchase = await PurchaseModel.findOne({
      downloadToken: token,
      status: 'completed',
    });

    if (!purchase) {
      return NextResponse.json({ success: false, error: 'Invalid or expired download link' }, { status: 404 });
    }

    // Check expiry
    if (purchase.downloadExpiry && new Date() > purchase.downloadExpiry) {
      return NextResponse.json({ success: false, error: 'Download link has expired' }, { status: 410 });
    }

    // Check download count limit (optional: max 5 downloads)
    if (purchase.downloadCount >= 5) {
      return NextResponse.json({ success: false, error: 'Download limit reached. Contact support.' }, { status: 403 });
    }

    // Get the project (with sourceFile)
    const project = await ProjectModel.findById(purchase.projectId).select('+sourceFile');
    if (!project || !project.sourceFile) {
      return NextResponse.json({ success: false, error: 'Source file not available' }, { status: 404 });
    }

    // Increment download count
    purchase.downloadCount += 1;
    await purchase.save();

    // The demo ZIP is bundled as a tiny base64 payload, so it works on Vercel's
    // read-only serverless filesystem without requiring an admin upload.
    if (project.sourceFile === DEMO_SOURCE_FILE) {
      const fileBuffer = Buffer.from(DEMO_ZIP_BASE64, 'base64');
      const fileName = `${project.slug}-source.zip`;
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-store, no-cache',
        },
      });
    }

    // Serve an admin-uploaded file from private storage
    const filePath = path.resolve(process.cwd(), 'private', project.sourceFile);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'File not found on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${project.slug}-source.zip`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store, no-cache',
      },
    });
  } catch (error) {
    console.error('[GET /api/download/:token]', error);
    return NextResponse.json({ success: false, error: 'Download failed' }, { status: 500 });
  }
}
