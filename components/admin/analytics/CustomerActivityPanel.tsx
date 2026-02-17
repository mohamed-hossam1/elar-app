
'use client';

import { CustomerActivitySummary } from '@/types/AdminAnalytics';

interface CustomerActivityPanelProps {
  activity: CustomerActivitySummary;
}

export function CustomerActivityPanel({ activity }: CustomerActivityPanelProps) {
  const metrics = [
    { label: 'New Users', value: activity.newUsers, sub: 'Total registered' },
    { label: 'Active Buyers', value: activity.activeBuyers, sub: 'Unique in range' },
    { label: 'Repeat Buyers', value: activity.repeatBuyers, sub: '2+ Orders' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="border border-black p-4 bg-black/2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-2">{m.label}</p>
            <p className="font-integral text-2xl font-black">{m.value}</p>
            <p className="mt-1 text-[10px] text-black/40 font-medium">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-black text-white p-6 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Loyalty Velocity</h4>
            <p className="text-2xl font-integral font-black tracking-tighter">{activity.repeatBuyerRate.toFixed(1)}%</p>
          </div>
          <div className="h-12 w-12 rounded-full border-4 border-white/10 border-t-white flex items-center justify-center">
            <span className="text-[10px] font-black">LTV</span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className="text-white/60">Repeat vs New</span>
            <span>{activity.repeatBuyers} / {activity.activeBuyers}</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${activity.repeatBuyerRate}%` }}
            />
          </div>
          <p className="text-[10px] text-white/40 italic leading-relaxed">
            Measures the percentage of buyers who placed more than one order during this specific timeframe.
          </p>
        </div>
      </div>
    </div>
  );
}
