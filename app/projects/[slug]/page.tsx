import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, CheckCircle2, IndianRupee, Package } from 'lucide-react';
import { sampleProjects } from '@/lib/sampleData';
import { Project } from '@/types';
import BuyButton from '@/components/projects/BuyButton';
import ScreenshotGallery from '@/components/projects/ScreenshotGallery';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.name,
    description: project.shortDescription,
    openGraph: {
      title: project.name,
      description: project.shortDescription,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  };
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects/${slug}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch {
    // Fall through
  }
  const sample = sampleProjects.find((p) => p.slug === slug);
  if (!sample) return null;
  return {
    ...sample,
    _id: `sample-${slug}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Project;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <div className="pt-24 pb-20">
      <div className="section max-w-6xl">
        {/* Back link */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="tech-badge capitalize">{project.category}</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">{project.name}</h1>
              <p className="text-muted text-lg leading-relaxed">{project.shortDescription}</p>
            </div>

            {/* Hero thumbnail */}
            {project.thumbnail && (
              <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden border border-border">
                <Image
                  src={project.thumbnail}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Screenshots</h2>
                <ScreenshotGallery screenshots={project.screenshots} projectName={project.name} />
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About This Project</h2>
              <div className="text-muted leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-badge text-sm px-3 py-1.5">{tech}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Purchase card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-6">
              {/* Price */}
              <div>
                <p className="text-muted text-sm mb-1">Source Code Price</p>
                <div className="flex items-center gap-1 text-4xl font-bold text-slate-900">
                  <IndianRupee size={28} className="text-accent" />
                  <span>{project.price.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-muted text-xs mt-1">One-time payment • Lifetime access</p>
              </div>

              {/* Includes */}
              <div className="space-y-2">
                {[
                  'Complete source code ZIP',
                  'Full project documentation',
                  'Setup instructions',
                  'Lifetime updates',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Buy button */}
              <BuyButton project={project} />

              {/* Live demo */}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}

              {/* Divider */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 text-muted text-xs">
                  <Package size={14} />
                  Secure payment via Razorpay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
