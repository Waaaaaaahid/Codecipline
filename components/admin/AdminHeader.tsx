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
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="text-sm text-muted">
        Welcome back,{' '}
        <span className="text-white font-medium">{adminEmail}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <User size={14} />
          Admin
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
}
