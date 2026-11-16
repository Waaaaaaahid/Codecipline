import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin — DevMarket' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
