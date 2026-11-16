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
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-muted">{projects.length} projects total</p>
        </div>
        <Link href="/admin/dashboard/projects/new" className="btn-primary min-h-11 w-full justify-center sm:w-auto">
          <PlusCircle size={17} />
          Add Project
        </Link>
      </div>

      <AdminProjectList projects={projects} />
    </div>
  );
}
