import { redirect } from 'next/navigation';
import { getAdminFromCookies } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect('/admin/login');

  return (
    <div className="flex min-h-screen flex-col bg-background md:h-screen md:flex-row md:overflow-hidden">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader adminEmail={admin.email} />
        <main className="min-w-0 flex-1 bg-background p-4 sm:p-6 md:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
