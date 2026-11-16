'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Eye, EyeOff, ExternalLink, IndianRupee } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

interface AdminProjectListProps {
  projects: any[];
}

export default function AdminProjectList({ projects: initialProjects }: AdminProjectListProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setToggling(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, published: !currentStatus } : p))
        );
      }
    } catch {}
    setToggling(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch {}
    setDeleting(null);
  };

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Add your first project to get started."
        action={
          <Link href="/admin/dashboard/projects/new" className="btn-primary">
            Add Project
          </Link>
        }
      />
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-muted font-medium p-4">Project</th>
              <th className="text-left text-muted font-medium p-4">Category</th>
              <th className="text-left text-muted font-medium p-4">Price</th>
              <th className="text-left text-muted font-medium p-4">Status</th>
              <th className="text-right text-muted font-medium p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-surface/40 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface border border-border flex-shrink-0">
                      {project.thumbnail ? (
                        <Image
                          src={project.thumbnail}
                          alt={project.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                          ?
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{project.name}</div>
                      <div className="text-muted text-xs font-mono">{project.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="default" className="capitalize">
                    {project.category}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-accent font-semibold">
                    <IndianRupee size={12} />
                    {project.price?.toLocaleString('en-IN')}
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={project.published ? 'success' : 'warning'}>
                    {project.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleTogglePublish(project._id, project.published)}
                      disabled={toggling === project._id}
                      title={project.published ? 'Unpublish' : 'Publish'}
                      className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-surface transition-all disabled:opacity-50"
                    >
                      {project.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <Link
                      href={`/admin/dashboard/projects/${project._id}/edit`}
                      title="Edit"
                      className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-all"
                    >
                      <Edit size={15} />
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      title="View public page"
                      className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-surface transition-all"
                    >
                      <ExternalLink size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id, project.name)}
                      disabled={deleting === project._id}
                      title="Delete"
                      className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
