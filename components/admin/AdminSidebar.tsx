'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  PlusCircle,
  ShoppingBag,
  Code2,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/dashboard/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/admin/dashboard/projects/new', icon: PlusCircle, label: 'Add Project' },
  { href: '/admin/dashboard/purchases', icon: ShoppingBag, label: 'Purchases' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-card border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">
            Dev<span className="text-accent">Market</span>
          </span>
        </Link>
        <div className="mt-2 text-xs text-muted">Admin Dashboard</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            pathname === href ||
            (href !== '/admin/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-white hover:bg-surface'
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-white hover:bg-surface transition-all duration-200"
        >
          View Site ↗
        </Link>
      </div>
    </aside>
  );
}
