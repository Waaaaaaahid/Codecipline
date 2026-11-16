import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/models/Project';
import { requireAdmin } from '@/lib/auth';
import { ensureDemoProject } from '@/lib/demo-project';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    await ensureDemoProject();
    const projects = await ProjectModel.find().sort({ createdAt: -1 }).lean();
    const data = projects.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[GET /api/admin/projects]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const project = await ProjectModel.create(body);
    return NextResponse.json(
      {
        success: true,
        data: { ...project.toJSON(), _id: project._id.toString() },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A project with this slug already exists' },
        { status: 409 }
      );
    }
    console.error('[POST /api/admin/projects]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
