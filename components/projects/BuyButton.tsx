'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { ShoppingCart, Mail, IndianRupee } from 'lucide-react';
import { Project } from '@/types';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface BuyButtonProps {
  project: Project;
}

export default function BuyButton({ project }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'idle' | 'info' | 'processing' | 'success' | 'error'>('idle');
  const [buyerInfo, setBuyerInfo] = useState({ name: '', email: '' });
  const [downloadInfo, setDownloadInfo] = useState<{ token: string; expiry: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyClick = () => {
    setStep('info');
    setErrorMsg('');
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Failed to load payment gateway.');

      // 2. Create order on backend
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project._id,
          projectSlug: project.slug,
          buyerName: buyerInfo.name,
          buyerEmail: buyerInfo.email,
        }),
      });

      const orderJson = await orderRes.json();
      if (!orderJson.success) throw new Error(orderJson.error || 'Failed to create order.');

      setStep('processing');

      // 3. Open Razorpay checkout
      const razorpay = new window.Razorpay({
        key: orderJson.data.razorpayKeyId,
        amount: orderJson.data.amount,
        currency: 'INR',
        name: 'DevMarket',
        description: `${project.name} — Source Code`,
        order_id: orderJson.data.orderId,
        image: '/logo.png',
        handler: async (response: RazorpayResponse) => {
          // 4. Verify payment on backend
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                buyerEmail: buyerInfo.email,
                buyerName: buyerInfo.name,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (verifyJson.success) {
              setDownloadInfo(verifyJson.data);
              setStep('success');
            } else {
              throw new Error(verifyJson.error || 'Payment verification failed.');
            }
          } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Verification failed.');
            setStep('error');
          }
        },
        prefill: {
          name: buyerInfo.name,
          email: buyerInfo.email,
        },
        theme: { color: '#FF6B35' },
        modal: {
          ondismiss: () => {
            setStep('info');
            setLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadInfo) return;
    window.open(`/api/download/${downloadInfo.token}`, '_blank');
  };

  // Success state
  if (step === 'success' && downloadInfo) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <p className="text-green-400 font-semibold text-sm">Payment Successful! 🎉</p>
          <p className="text-muted text-xs mt-1">
            Download link expires at{' '}
            {new Date(downloadInfo.expiry).toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={handleDownload} fullWidth size="lg" variant="primary">
          Download Source Code
        </Button>
        <p className="text-muted text-xs text-center">
          Link also sent to {buyerInfo.email}
        </p>
      </div>
    );
  }

  // Error state
  if (step === 'error') {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {errorMsg}
        </div>
        <Button onClick={() => setStep('idle')} fullWidth variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  // Buyer info form
  if (step === 'info' || step === 'processing') {
    return (
      <form onSubmit={handleInfoSubmit} className="space-y-3">
        <p className="text-muted text-sm">Enter your details to proceed:</p>
        <div>
          <label className="label text-xs">Full Name</label>
          <input
            type="text"
            value={buyerInfo.name}
            onChange={(e) => setBuyerInfo((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
            required
            className="input-field py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="label text-xs">Email Address</label>
          <input
            type="email"
            value={buyerInfo.email}
            onChange={(e) => setBuyerInfo((p) => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com"
            required
            className="input-field py-2.5 text-sm"
          />
        </div>
        <Button
          type="submit"
          loading={loading || step === 'processing'}
          fullWidth
          size="md"
        >
          <IndianRupee size={16} />
          Pay ₹{project.price.toLocaleString('en-IN')}
        </Button>
        <button
          type="button"
          onClick={() => setStep('idle')}
          className="w-full text-muted text-xs hover:text-white transition-colors"
        >
          Cancel
        </button>
      </form>
    );
  }

  // Default: Buy button
  return (
    <Button onClick={handleBuyClick} fullWidth size="lg" className="group">
      <ShoppingCart size={18} />
      Buy & Download — ₹{project.price.toLocaleString('en-IN')}
    </Button>
  );
}
