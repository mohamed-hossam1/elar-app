"use client";

import { TrendData } from "@/types/AdminAnalytics";

interface RevenueOrdersTrendProps {
  trends: TrendData;
}

export function RevenueOrdersTrend({ trends }: RevenueOrdersTrendProps) {
  const totalRevenue = trends.revenueSeries.reduce(
    (sum, point) => sum + point.value,
    0,
  );
  const avgRevenue =
    trends.revenueSeries.length > 0
      ? totalRevenue / trends.revenueSeries.length
      : 0;
  const totalComparisonRevenue = trends.revenueSeries.reduce(
    (sum, point) => sum + (point.comparisonValue || 0),
    0,
  );
  const revenueChange =
    totalComparisonRevenue > 0
      ? ((totalRevenue - totalComparisonRevenue) / totalComparisonRevenue) * 100
      : 0;

  const totalOrders = trends.ordersSeries.reduce(
    (sum, point) => sum + point.value,
    0,
  );
  const totalComparisonOrders = trends.ordersSeries.reduce(
    (sum, point) => sum + (point.comparisonValue || 0),
    0,
  );
  const ordersChange =
    totalComparisonOrders > 0
      ? ((totalOrders - totalComparisonOrders) / totalComparisonOrders) * 100
      : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value > 0 ? "↑" : value < 0 ? "↓" : "";
    return `${sign} ${Math.abs(value).toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-black p-4 bg-black/2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3">
            Total Revenue
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-integral text-2xl font-black">
              {formatCurrency(totalRevenue)}
            </p>
            <p
              className={`text-xs font-bold ${revenueChange >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {formatPercent(revenueChange)}
            </p>
          </div>
          <div className="mt-2 text-[10px] text-black/40 font-medium">
            Daily avg: {formatCurrency(avgRevenue)}
          </div>
        </div>

        <div className="border border-black p-4 bg-black/2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-3">
            Order Volume
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-integral text-2xl font-black">{totalOrders}</p>
            <p
              className={`text-xs font-bold ${ordersChange >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {formatPercent(ordersChange)}
            </p>
          </div>
          <div className="mt-2 text-[10px] text-black/40 font-medium">
            {trends.ordersSeries.length} days tracked
          </div>
        </div>
      </div>

      <div className="relative border border-black overflow-hidden bg-white">
        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-black text-white text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="text-left py-3 px-4">Timeline</th>
                <th className="text-right py-3 px-4">Revenue</th>
                <th className="text-right py-3 px-4">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {trends.revenueSeries.map((point, idx) => (
                <tr
                  key={point.date}
                  className="hover:bg-black/3 transition-colors group"
                >
                  <td className="text-left py-3 px-4 text-black/60 font-medium group-hover:text-black">
                    {point.date}
                  </td>
                  <td className="text-right py-3 px-4 font-bold">
                    {formatCurrency(point.value)}
                  </td>
                  <td className="text-right py-3 px-4 font-bold text-black/40 group-hover:text-black">
                    {trends.ordersSeries[idx]?.value || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
