import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'No items to display.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
        {icon || <PackageOpen size={28} className="text-muted" />}
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}
