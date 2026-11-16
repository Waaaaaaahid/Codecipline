import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/models/Project';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const project = await ProjectModel.findOne({
      slug: params.slug,
      published: true,
    }).lean();

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Never expose sourceFile
    const { sourceFile, ...safeProject } = project as typeof project & { sourceFile?: string };

    return NextResponse.json({ success: true, data: safeProject });
  } catch (error) {
    console.error('[GET /api/projects/:slug]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
  }
}
