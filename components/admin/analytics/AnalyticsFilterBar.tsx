'use client';

import { useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminAnalyticsFilters } from '@/types/AdminAnalytics';

interface AnalyticsFilterBarProps {
  currentFilters: AdminAnalyticsFilters;
}

const RANGE_PRESETS = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'mtd', label: 'Month to Date' },
  { value: 'custom', label: 'Custom Range' },
] as const;

export function AnalyticsFilterBar({ currentFilters }: AnalyticsFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [range, setRange] = useState<AdminAnalyticsFilters['range']>(
    (currentFilters.range as AdminAnalyticsFilters['range']) || 'last_30_days',
  );
  const [from, setFrom] = useState(currentFilters.from || '');
  const [to, setTo] = useState(currentFilters.to || '');
  const [error, setError] = useState<string | null>(null);

  const handleRangeChange = (newRange: AdminAnalyticsFilters['range']) => {
    setRange(newRange);
    setError(null);

    if (newRange !== 'custom') {
      setFrom('');
      setTo('');
      updateUrl({ range: newRange });
    }
  };

  const handleCustomDateChange = () => {
    if (!from || !to) {
      setError('Both start and end dates are required for custom range');
      return;
    }

    if (from > to) {
      setError('Start date must be before end date');
      return;
    }

    const daysDiff = Math.floor((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 366) {
      setError('Date range cannot exceed 366 days');
      return;
    }

    setError(null);
    updateUrl({ range: 'custom', from, to });
  };

  const updateUrl = (filters: Partial<AdminAnalyticsFilters>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      
      if (filters.range) params.set('range', filters.range);
      if (filters.from) params.set('from', filters.from);
      else params.delete('from');
      
      if (filters.to) params.set('to', filters.to);
      else params.delete('to');

      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {RANGE_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handleRangeChange(preset.value as AdminAnalyticsFilters['range'])}
            className={`px-3 py-2 text-sm font-medium border transition ${
              range === preset.value
                ? 'border-black bg-black text-white'
                : 'border-black/20 bg-white text-black hover:border-black'
            }`}
            disabled={isPending}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {range === 'custom' && (
        <div className="space-y-3 rounded border border-black/10 p-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-black/70 mb-1">Start Date</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full border border-black/20 px-2 py-1 text-sm"
                disabled={isPending}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-black/70 mb-1">End Date</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full border border-black/20 px-2 py-1 text-sm"
                disabled={isPending}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCustomDateChange}
                className="px-3 py-1 text-sm font-medium border border-black bg-black text-white hover:bg-white hover:text-black transition disabled:opacity-50"
                disabled={isPending}
              >
                Apply
              </button>
            </div>
          </div>
          {error && <div className="text-xs text-red-600">{error}</div>}
        </div>
      )}
    </div>
  );
}
