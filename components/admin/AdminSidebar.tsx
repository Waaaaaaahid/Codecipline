'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FolderOpen, PlusCircle, ShoppingBag, Code2, Menu, X,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/dashboard/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/admin/dashboard/projects/new', icon: PlusCircle, label: 'Add Project' },
  { href: '/admin/dashboard/purchases', icon: ShoppingBag, label: 'Purchases' },
];

function Brand() {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
        <Code2 size={19} className="text-white" />
      </span>
      <span className="truncate text-base font-bold text-white">
        Dev<span className="text-accent">Market</span>
      </span>
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="flex-1 space-y-1 p-3">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={clsx(
              'flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
              isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface hover:text-white'
            )}
          >
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-border p-3">
      <Link href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted transition-colors hover:bg-surface hover:text-white">
        <span>↗</span><span>View Site</span>
      </Link>
    </div>
  );

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin navigation"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-white hover:bg-surface"
        >
          <Menu size={21} />
        </button>
      </div>

      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-5">
          <Brand />
          <p className="mt-3 text-xs text-muted">Admin Dashboard</p>
        </div>
        {links}
        {footer}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-label="Close navigation" />
          <aside className="absolute inset-y-0 left-0 flex w-[min(84vw,300px)] flex-col border-r border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="min-w-0"><Brand /><p className="mt-2 text-xs text-muted">Admin Dashboard</p></div>
              <button onClick={() => setOpen(false)} aria-label="Close navigation" className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface hover:text-white"><X size={20} /></button>
            </div>
            {links}
            {footer}
          </aside>
        </div>
      )}
    </>
  );
}
