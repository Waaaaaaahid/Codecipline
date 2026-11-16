import { redirect } from 'next/navigation';
import { getAdminFromCookies } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect('/admin/login');

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader adminEmail={admin.email} />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
