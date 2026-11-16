import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ArrowRight, IndianRupee } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const categoryColors: Record<string, 'default' | 'accent' | 'success' | 'warning'> = {
    saas: 'accent',
    ecommerce: 'success',
    websites: 'warning',
    applications: 'default',
    other: 'default',
  };

  return (
    <div className={`card overflow-hidden group flex flex-col ${featured ? 'shadow-card' : ''}`}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-48 bg-surface flex-shrink-0">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted text-sm">No thumbnail</span>
          </div>
        )}
        {/* Category badge overlay */}
        <div className="absolute top-3 left-3">
          <Badge variant={categoryColors[project.category] || 'default'}>
            {project.category}
          </Badge>
        </div>
        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="accent">Featured</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-1">
          {project.name}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {project.shortDescription}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="tech-badge">+{project.technologies.length - 4}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-accent font-bold text-lg">
            <IndianRupee size={16} />
            <span>{project.price.toLocaleString('en-IN')}</span>
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="btn-primary py-2 px-4 text-xs group/btn"
          >
            View Details
            <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
