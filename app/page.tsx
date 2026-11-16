import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import AboutSnippet from '@/components/home/AboutSnippet';
import { ProjectCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { sampleProjects } from '@/lib/sampleData';
import { Project } from '@/types';

async function getFeaturedProjects(): Promise<Project[]> {
  // Try to fetch from API, fall back to sample data
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects?featured=true&limit=3`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.length > 0) return json.data;
    }
  } catch {
    // Fall through to sample data
  }
  return sampleProjects.filter((p) => p.featured).slice(0, 3).map((p, i) => ({
    ...p,
    _id: `sample-${i}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) as Project[];
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <AboutSnippet />
    </>
  );
}
