import { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { ProjectModel } from '@/models/Project';
import { PurchaseModel } from '@/models/Purchase';
import { TrendingUp, Package, ShoppingBag, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Dashboard' };

async function getDashboardStats() {
  await connectDB();
  const [totalProjects, publishedProjects, purchases] = await Promise.all([
    ProjectModel.countDocuments(),
    ProjectModel.countDocuments({ published: true }),
    PurchaseModel.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const totalEarnings = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

  return {
    totalProjects,
    publishedProjects,
    totalSales: purchases.length,
    totalEarnings,
    recentPurchases: purchases,
  };
}

export default async function DashboardPage() {
  let stats = {
    totalProjects: 0,
    publishedProjects: 0,
    totalSales: 0,
    totalEarnings: 0,
    recentPurchases: [] as any[],
  };

  try {
    stats = await getDashboardStats();
  } catch {
    // DB not configured yet
  }

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: Package, color: 'text-blue-400' },
    { label: 'Published', value: stats.publishedProjects, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Total Sales', value: stats.totalSales, icon: ShoppingBag, color: 'text-accent' },
    {
      label: 'Total Earnings',
      value: `₹${stats.totalEarnings.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Overview of your portfolio marketplace.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-muted text-sm">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <div className="text-2xl font-bold text-white stat-number">{value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/dashboard/projects/new"
          className="card p-5 flex items-center gap-4 hover:border-accent/40 group"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Package size={20} className="text-accent" />
          </div>
          <div>
            <div className="text-white font-medium">Add New Project</div>
            <div className="text-muted text-sm">Publish a new source code listing</div>
          </div>
        </Link>
        <Link
          href="/admin/dashboard/purchases"
          className="card p-5 flex items-center gap-4 hover:border-accent/40 group"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <ShoppingBag size={20} className="text-accent" />
          </div>
          <div>
            <div className="text-white font-medium">View Purchases</div>
            <div className="text-muted text-sm">See all orders and earnings</div>
          </div>
        </Link>
      </div>

      {/* Recent Purchases */}
      <div className="card p-6">
        <h2 className="text-white font-semibold mb-4">Recent Purchases</h2>
        {stats.recentPurchases.length === 0 ? (
          <p className="text-muted text-sm">No purchases yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted font-medium pb-3">Buyer</th>
                  <th className="text-left text-muted font-medium pb-3">Project</th>
                  <th className="text-left text-muted font-medium pb-3">Amount</th>
                  <th className="text-left text-muted font-medium pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentPurchases.map((p: any) => (
                  <tr key={p._id?.toString()} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3">
                      <div className="text-white font-medium">{p.buyerName}</div>
                      <div className="text-muted text-xs">{p.buyerEmail}</div>
                    </td>
                    <td className="py-3 text-muted-light">{p.projectName}</td>
                    <td className="py-3 text-accent font-medium">
                      ₹{p.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-muted text-xs">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString('en-IN')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
