'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Upload, X } from 'lucide-react';

interface ProjectFormProps {
  project?: any;
}

const CATEGORIES = ['websites', 'ecommerce', 'saas', 'applications', 'other'];

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!project;

  const [form, setForm] = useState({
    name: project?.name || '',
    slug: project?.slug || '',
    shortDescription: project?.shortDescription || '',
    description: project?.description || '',
    category: project?.category || 'websites',
    price: project?.price || '',
    liveUrl: project?.liveUrl || '',
    technologies: project?.technologies?.join(', ') || '',
    features: project?.features?.join('\n') || '',
    thumbnail: project?.thumbnail || '',
    screenshots: project?.screenshots?.join('\n') || '',
    published: project?.published ?? false,
    featured: project?.featured ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((p) => ({ ...p, name, slug: !isEdit ? autoSlug(name) : p.slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...form,
        price: parseFloat(String(form.price)),
        technologies: form.technologies
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean),
        features: form.features
          .split('\n')
          .map((f: string) => f.trim())
          .filter(Boolean),
        screenshots: form.screenshots
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean),
      };

      const url = isEdit
        ? `/api/admin/projects/${project._id}`
        : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || 'Failed to save project');
        setLoading(false);
        return;
      }

      // Upload ZIP if selected
      if (zipFile) {
        const projectId = json.data._id || project?._id;
        const formData = new FormData();
        formData.append('file', zipFile);
        formData.append('projectId', projectId);
        const uploadRes = await fetch('/api/admin/upload/zip', {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) {
          setError(`Project saved but ZIP upload failed: ${uploadJson.error}`);
          setLoading(false);
          return;
        }
      }

      setSuccess(isEdit ? 'Project updated successfully!' : 'Project created successfully!');
      setTimeout(() => router.push('/admin/dashboard/projects'), 1200);
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6 space-y-5">
        <h2 className="text-white font-semibold text-base border-b border-border pb-3">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Project Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleNameChange}
              required
              className="input-field"
              placeholder="My Awesome Project"
            />
          </div>
          <div>
            <label className="label">
              URL Slug *{' '}
              <span className="text-muted text-xs font-normal">(auto-generated)</span>
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="input-field font-mono text-sm"
              placeholder="my-awesome-project"
            />
          </div>
        </div>

        <div>
          <label className="label">
            Short Description *{' '}
            <span className="text-muted text-xs font-normal">
              ({form.shortDescription.length}/200)
            </span>
          </label>
          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            required
            maxLength={200}
            className="input-field"
            placeholder="One-line summary shown in project cards"
          />
        </div>

        <div>
          <label className="label">Full Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={7}
            className="input-field resize-none"
            placeholder="Detailed description of the project, its purpose, and what makes it special..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="label">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-field"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-surface capitalize">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Price (INR) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="input-field"
              placeholder="1999"
            />
          </div>
          <div>
            <label className="label">Live Demo URL</label>
            <input
              type="url"
              name="liveUrl"
              value={form.liveUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://demo.example.com"
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="card p-6 space-y-5">
        <h2 className="text-white font-semibold text-base border-b border-border pb-3">
          Media
        </h2>

        <div>
          <label className="label">Thumbnail URL</label>
          <input
            name="thumbnail"
            value={form.thumbnail}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/thumbnail.jpg"
          />
          {form.thumbnail && (
            <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.thumbnail}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              />
            </div>
          )}
        </div>

        <div>
          <label className="label">
            Screenshot URLs{' '}
            <span className="text-muted text-xs font-normal">(one URL per line)</span>
          </label>
          <textarea
            name="screenshots"
            value={form.screenshots}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none font-mono text-xs"
            placeholder={`https://example.com/screenshot1.jpg\nhttps://example.com/screenshot2.jpg`}
          />
        </div>
      </div>

      {/* Technologies & Features */}
      <div className="card p-6 space-y-5">
        <h2 className="text-white font-semibold text-base border-b border-border pb-3">
          Technologies & Features
        </h2>

        <div>
          <label className="label">
            Tech Stack{' '}
            <span className="text-muted text-xs font-normal">(comma-separated)</span>
          </label>
          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            className="input-field"
            placeholder="Next.js, TypeScript, MongoDB, Tailwind CSS, Razorpay"
          />
        </div>

        <div>
          <label className="label">
            Features{' '}
            <span className="text-muted text-xs font-normal">(one feature per line)</span>
          </label>
          <textarea
            name="features"
            value={form.features}
            onChange={handleChange}
            rows={7}
            className="input-field resize-none"
            placeholder={`Real-time analytics dashboard\nRole-based access control\nStripe billing integration\nMobile responsive design`}
          />
        </div>
      </div>

      {/* Source Code ZIP */}
      <div className="card p-6 space-y-4">
        <h2 className="text-white font-semibold text-base border-b border-border pb-3">
          Source Code ZIP
        </h2>
        <p className="text-muted text-sm">
          Upload the ZIP file buyers will download after payment. Stored securely, never publicly accessible.
        </p>

        <div className="flex items-center gap-3">
          <label className="btn-secondary cursor-pointer text-sm">
            <Upload size={15} />
            {zipFile ? zipFile.name : 'Choose ZIP file'}
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => setZipFile(e.target.files?.[0] || null)}
            />
          </label>
          {zipFile && (
            <button
              type="button"
              onClick={() => setZipFile(null)}
              className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {project?.sourceFile && !zipFile && (
          <p className="text-muted text-xs mt-1">
            Current ZIP:{' '}
            <span className="text-muted-light font-mono">{project.sourceFile}</span>
          </p>
        )}
      </div>

      {/* Visibility */}
      <div className="card p-6 space-y-4">
        <h2 className="text-white font-semibold text-base border-b border-border pb-3">
          Visibility
        </h2>

        <div className="space-y-4">
          {[
            {
              name: 'published',
              label: 'Published',
              desc: 'Visible to public visitors on the projects page',
            },
            {
              name: 'featured',
              label: 'Featured',
              desc: 'Shown in the Featured Projects section on the homepage',
            },
          ].map(({ name, label, desc }) => (
            <label key={name} className="flex items-center gap-4 cursor-pointer group">
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  name={name}
                  checked={(form as any)[name]}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 rounded-full bg-surface border border-border peer-checked:bg-accent peer-checked:border-accent transition-all duration-200" />
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-muted peer-checked:bg-white peer-checked:translate-x-5 transition-all duration-200" />
              </div>
              <div>
                <div className="text-white text-sm font-medium">{label}</div>
                <div className="text-muted text-xs">{desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pb-4">
        <Button type="submit" loading={loading} size="lg">
          {isEdit ? 'Save Changes' : 'Create Project'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
