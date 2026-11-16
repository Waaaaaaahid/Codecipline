'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

interface AdminHeaderProps {
  adminEmail: string;
}

export default function AdminHeader({ adminEmail }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-card px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <p className="text-xs text-muted sm:text-sm">Welcome back,</p>
        <p className="max-w-[52vw] truncate text-sm font-semibold text-slate-900 sm:max-w-none sm:text-base">{adminEmail}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 text-sm text-muted sm:flex">
          <User size={16} /> Admin
        </div>
        <button
          onClick={handleLogout}
          className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-muted transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          aria-label="Logout"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
