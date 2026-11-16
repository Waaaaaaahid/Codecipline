'use client';

import { clsx } from 'clsx';

export type Category = 'all' | 'websites' | 'ecommerce' | 'saas' | 'applications' | 'other';

interface CategoryFilterProps {
  selected: Category;
  onChange: (cat: Category) => void;
  counts?: Record<string, number>;
}

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'websites', label: 'Websites' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'applications', label: 'Applications' },
  { value: 'other', label: 'Other' },
];

export default function CategoryFilter({ selected, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={clsx(
            'min-h-10 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200',
            selected === value
              ? 'bg-accent text-white shadow-accent-sm'
              : 'bg-surface border border-border text-muted hover:text-white hover:border-accent/50'
          )}
        >
          {label}
          {counts && counts[value] !== undefined && (
            <span
              className={clsx(
                'ml-1.5 text-xs',
                selected === value ? 'text-white/70' : 'text-muted'
              )}
            >
              ({counts[value]})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
