import { Metadata } from 'next';
import ProjectGrid from '@/components/projects/ProjectGrid';
import { sampleProjects } from '@/lib/sampleData';
import { Project } from '@/types';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Browse all available projects and purchase source code.',
};

async function getAllProjects(): Promise<Project[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects?published=true`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.length > 0) return json.data;
    }
  } catch {
    // Fall through
  }
  return sampleProjects.map((p, i) => ({
    ...p,
    _id: `sample-${i}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) as Project[];
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="pt-24 pb-20">
      <div className="section">
        {/* Header */}
        <div className="mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Source Code Marketplace
          </p>
          <h1 className="section-title mb-3">
            All <span className="gradient-text">Projects</span>
          </h1>
          <p className="section-subtitle max-w-xl">
            Browse production-ready projects. Each comes with clean code, documentation, and lifetime access.
          </p>
        </div>

        {/* Grid with filters */}
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
