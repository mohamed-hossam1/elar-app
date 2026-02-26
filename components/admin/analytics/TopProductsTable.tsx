"use client";

import { TopProductRow } from "@/types/AdminAnalytics";

interface TopProductsTableProps {
  products: TopProductRow[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-black/10">
        <p className="text-sm text-black/40">No product sales data recorded</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.unitsSold, 0);

  return (
    <div className="space-y-6">
      <div className="relative border border-black overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black text-white text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="text-left py-3 px-4">Catalog Item</th>
              <th className="text-right py-3 px-4">Qty</th>
              <th className="text-right py-3 px-4">Revenue</th>
              <th className="text-right py-3 px-4">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {products.map((product) => (
              <tr
                key={product.productId}
                className="hover:bg-black/3 transition-colors group"
              >
                <td className="text-left py-3 px-4">
                  <p className="font-bold truncate max-w-50">
                    {product.title}
                  </p>
                  <p className="text-[10px] text-black/40 font-medium">
                    ID: {product.productId.slice(0, 8)}
                  </p>
                </td>
                <td className="text-right py-3 px-4 font-black">
                  {product.unitsSold}
                </td>
                <td className="text-right py-3 px-4 font-bold">
                  {formatCurrency(product.revenue)}
                </td>
                <td className="text-right py-3 px-4">
                  <span className="text-[10px] font-black bg-black/5 px-2 py-1">
                    {totalRevenue > 0
                      ? ((product.revenue / totalRevenue) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-black/2 border-t border-black/10">
            <tr className="font-black text-xs">
              <td className="py-3 px-4 uppercase tracking-tighter">
                Inventory Totals
              </td>
              <td className="text-right py-3 px-4">{totalUnits}</td>
              <td className="text-right py-3 px-4">
                {formatCurrency(totalRevenue)}
              </td>
              <td className="py-3 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
