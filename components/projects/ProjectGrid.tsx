'use client';

import { useState } from 'react';
import ProjectCard from './ProjectCard';
import CategoryFilter, { Category } from './CategoryFilter';
import EmptyState from '@/components/ui/EmptyState';
import { Project } from '@/types';
import { Search } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');

  const counts = projects.reduce<Record<string, number>>((acc, p) => {
    acc['all'] = (acc['all'] || 0) + 1;
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const filtered = projects.filter((p) => {
    const matchCat = category === 'all' || p.category === category;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5"
          />
        </div>
        {/* Filters */}
        <CategoryFilter selected={category} onChange={setCategory} counts={counts} />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={
            search
              ? `No results for "${search}". Try a different search term.`
              : 'No projects in this category yet.'
          }
        />
      ) : (
        <>
          <p className="text-muted text-sm">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
