import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/models/Project';
import { ensureDemoProject } from '@/lib/demo-project';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await ensureDemoProject();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: Record<string, unknown> = {};

    if (featured === 'true') query.featured = true;
    if (published === 'true') query.published = true;
    if (category && category !== 'all') query.category = category;

    const projects = await ProjectModel.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    // Strip sourceFile from all projects
    const safeProjects = projects.map(({ sourceFile, ...p }) => p);

    return NextResponse.json({ success: true, data: safeProjects });
  } catch (error) {
    console.error('[GET /api/projects]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}
