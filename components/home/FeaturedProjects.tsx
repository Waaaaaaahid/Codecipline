import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="py-24 border-t border-border/50">
      <div className="section">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
              Featured Work
            </p>
            <h2 className="section-title">
              Projects Worth{' '}
              <span className="gradient-text">Buying</span>
            </h2>
            <p className="section-subtitle">
              Hand-picked projects with clean code and detailed documentation.
            </p>
          </div>
          <Link href="/projects" className="btn-secondary whitespace-nowrap self-start sm:self-auto group">
            All Projects
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
