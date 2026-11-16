import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/models/Project';
import ProjectForm from '@/components/admin/ProjectForm';

export const metadata: Metadata = { title: 'Edit Project' };

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  let project = null;

  try {
    await connectDB();
    const doc = await ProjectModel.findById(params.id).lean();
    if (doc) {
      project = { ...(doc as any), _id: (doc as any)._id.toString() };
    }
  } catch {}

  if (!project) notFound();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Project</h1>
        <p className="text-muted text-sm mt-1">
          Updating &quot;{project.name}&quot;
        </p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
