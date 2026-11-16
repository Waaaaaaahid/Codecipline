import { Metadata } from 'next';
import ProjectForm from '@/components/admin/ProjectForm';

export const metadata: Metadata = { title: 'Add New Project' };

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add New Project</h1>
        <p className="text-muted text-sm mt-1">Fill in the details to publish a new project.</p>
      </div>
      <ProjectForm />
    </div>
  );
}
