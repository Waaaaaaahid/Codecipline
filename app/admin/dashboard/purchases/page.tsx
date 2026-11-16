import { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { PurchaseModel } from '@/models/Purchase';
import Badge from '@/components/ui/Badge';
import { IndianRupee } from 'lucide-react';

export const metadata: Metadata = { title: 'Purchases' };

export default async function PurchasesPage() {
  let purchases: any[] = [];
  let totalEarnings = 0;

  try {
    await connectDB();
    purchases = await PurchaseModel.find().sort({ createdAt: -1 }).limit(200).lean();
    totalEarnings = purchases
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  } catch {
    // DB not configured yet
  }

  const completedCount = purchases.filter((p) => p.status === 'completed').length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Purchases</h1>
          <p className="text-muted text-sm mt-1">
            {purchases.length} total orders &bull; {completedCount} completed
          </p>
        </div>
        <div className="card px-5 py-3">
          <p className="text-muted text-xs mb-1">Total Earnings</p>
          <div className="flex items-center gap-1 text-xl font-bold text-accent">
            <IndianRupee size={16} />
            {totalEarnings.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {purchases.length === 0 ? (
          <div className="p-16 text-center text-muted">No purchases yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Buyer', 'Project', 'Amount', 'Status', 'Date', 'Downloads'].map(
                    (h) => (
                      <th key={h} className="text-left text-muted font-medium p-4">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {purchases.map((p: any) => (
                  <tr
                    key={p._id?.toString()}
                    className="hover:bg-surface/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-white font-medium">{p.buyerName}</div>
                      <div className="text-muted text-xs">{p.buyerEmail}</div>
                    </td>
                    <td className="p-4 text-muted-light">{p.projectName}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-accent font-medium">
                        <IndianRupee size={12} />
                        {p.amount?.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          p.status === 'completed'
                            ? 'success'
                            : p.status === 'failed'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted text-xs">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="p-4 text-muted">{p.downloadCount ?? 0}</td>
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
