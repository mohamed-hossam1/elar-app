'use client';

import { OrderDistributions } from '@/types/AdminAnalytics';

interface StatusDistributionProps {
  distributions: OrderDistributions;
}

export function StatusDistribution({ distributions }: StatusDistributionProps) {
  const statusEntries = Object.entries(distributions.orderStatus).sort((a, b) => b[1] - a[1]);
  const paymentEntries = Object.entries(distributions.paymentMethod).sort((a, b) => b[1] - a[1]);

  const totalStatus = statusEntries.reduce((sum, [, count]) => sum + count, 0);
  const totalPayment = paymentEntries.reduce((sum, [, count]) => sum + count, 0);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500';
      case 'cancelled': return 'bg-red-500';
      case 'confirmed': return 'bg-sky-500';
      case 'shipped': return 'bg-indigo-500';
      default: return 'bg-black/20';
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Order Status</h4>
          <span className="text-[10px] font-bold text-black/30">{totalStatus} Total</span>
        </div>
        <div className="space-y-4">
          {statusEntries.map(([status, count]) => (
            <div key={status} className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span>{status}</span>
                <span>{count}</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${getStatusColor(status)}`}
                  style={{ width: `${totalStatus > 0 ? (count / totalStatus) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Payment Methods</h4>
          <span className="text-[10px] font-bold text-black/30">{totalPayment} Volume</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {paymentEntries.map(([method, count]) => (
            <div key={method} className="flex items-center justify-between p-3 border border-black/5 bg-black/1 hover:bg-black/3 transition-colors">
              <span className="text-xs font-bold uppercase tracking-tight">{method.replace('_', ' ')}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black">{count}</span>
                <span className="text-[10px] text-black/30 font-medium w-8 text-right">
                  {totalPayment > 0 ? Math.round((count / totalPayment) * 100) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-black/10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Guest Ordering</p>
          <span className="text-xs font-black">{distributions.guestShare.toFixed(1)}%</span>
        </div>
        <div className="h-1 w-full bg-black/5 overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-1000"
            style={{ width: `${distributions.guestShare}%` }}
          />
        </div>
      </div>
    </div>
  );
}
