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

  const maxRevenue = Math.max(0, ...trends.revenueSeries.map((p) => p.value));
  const maxOrders = Math.max(0, ...trends.ordersSeries.map((p) => p.value));

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

      <div className="relative border border-black bg-white p-4 sm:p-6 pt-16">
        <div 
          className="w-full flex items-end gap-[2px] sm:gap-1 relative" 
          style={{ height: "250px" }}
        >
          {trends.revenueSeries.map((point, idx) => {
            const revenueHeight =
              maxRevenue > 0 ? (point.value / maxRevenue) * 100 : 0;
            const ordersVal = trends.ordersSeries[idx]?.value || 0;
            const ordersHeight =
              maxOrders > 0 ? (ordersVal / maxOrders) * 100 : 0;

            return (
              <div
                key={point.date}
                className="flex-1 h-full group relative flex items-end gap-[1px]"
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] p-2 sm:p-3 whitespace-nowrap z-10 pointer-events-none transition-opacity flex flex-col gap-1 shadow-xl rounded-sm">
                  <p className="font-bold border-b border-white/20 pb-1 mb-1">
                    {point.date}
                  </p>
                  <div className="flex items-center gap-4 justify-between">
                    <span className="text-white/60">Revenue</span>
                    <span className="font-mono">
                      {formatCurrency(point.value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 justify-between">
                    <span className="text-white/60">Orders</span>
                    <span className="font-mono">{ordersVal}</span>
                  </div>
                </div>

                {/* Bars */}
                <div
                  className="w-1/2 bg-black/10 group-hover:bg-black/30 transition-colors rounded-t-[1px]"
                  style={{ height: `${Math.max(0.5, ordersHeight)}%` }}
                />
                <div
                  className="w-1/2 bg-black/40 group-hover:bg-black transition-colors rounded-t-[1px]"
                  style={{ height: `${Math.max(0.5, revenueHeight)}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Legend & X-Axis label */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-black/10 pt-4 gap-4">
          <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
            {trends.revenueSeries[0]?.date || ""} -{" "}
            {trends.revenueSeries[trends.revenueSeries.length - 1]?.date || ""}
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-black/60">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-black/40"></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-black/10"></div>
              <span>Orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
