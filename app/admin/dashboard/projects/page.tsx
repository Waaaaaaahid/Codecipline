import { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/models/Project';
import AdminProjectList from '@/components/admin/AdminProjectList';
import { PlusCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Manage Projects' };

export default async function AdminProjectsPage() {
  let projects: any[] = [];

  try {
    await connectDB();
    const docs = await ProjectModel.find().sort({ createdAt: -1 }).lean();
    projects = docs.map((p: any) => ({ ...p, _id: p._id.toString() }));
  } catch {
    // DB not configured yet
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-muted text-sm mt-1">{projects.length} projects total</p>
        </div>
        <Link href="/admin/dashboard/projects/new" className="btn-primary">
          <PlusCircle size={16} />
          Add Project
        </Link>
      </div>

      <AdminProjectList projects={projects} />
    </div>
  );
}
