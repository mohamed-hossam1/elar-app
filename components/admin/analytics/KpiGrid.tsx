'use client';

import { KpiMetrics } from '@/types/AdminAnalytics';
import { AdminMetricCard } from '@/components/admin/AdminUI';

interface KpiGridProps {
  kpis: KpiMetrics;
}

interface KpiCard {
  label: string;
  value: string | number;
  format?: 'currency' | 'number' | 'percent';
}

export function KpiGrid({ kpis }: KpiGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const cards: KpiCard[] = [
    {
      label: 'Recognized Revenue',
      value: kpis.recognizedRevenue,
      format: 'currency',
    },
    {
      label: 'Delivered Orders',
      value: kpis.deliveredOrders,
      format: 'number',
    },
    {
      label: 'Total Orders',
      value: kpis.totalOrders,
      format: 'number',
    },
    {
      label: 'Average Order Value',
      value: kpis.averageOrderValue,
      format: 'currency',
    },
    {
      label: 'Unique Buyers',
      value: kpis.uniqueBuyers,
      format: 'number',
    },
    {
      label: 'Repeat Buyer Rate',
      value: kpis.repeatBuyerRate,
      format: 'percent',
    },
  ];

  const formatValue = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'number':
        return formatNumber(value);
      case 'percent':
        return formatPercent(value);
      default:
        return value;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <AdminMetricCard 
          key={card.label} 
          label={card.label} 
          value={formatValue(card.value as number, card.format)} 
        />
      ))}
    </div>
  );
}
