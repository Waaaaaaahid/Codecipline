import { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { Code2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Login',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Code2 size={22} className="text-white" />
          </div>
          <span className="font-bold text-xl text-white">
            Dev<span className="text-accent">Market</span>
          </span>
        </div>

        <div className="card p-7">
          <h1 className="text-xl font-bold text-white mb-1 text-center">Admin Login</h1>
          <p className="text-muted text-sm text-center mb-7">Sign in to manage your portfolio</p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
