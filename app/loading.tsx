import { ProjectCardSkeleton, Skeleton } from '@/components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="pt-24 pb-20">
      <div className="section">
        <div className="mb-12">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-10 w-72 mb-3" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
