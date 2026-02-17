'use client';

import Link from 'next/link';
import { RecentTransactionRow } from '@/types/AdminAnalytics';
import { AdminStatusBadge } from '@/components/admin/AdminUI';
import { Eye, User, UserCheck } from 'lucide-react';

interface RecentTransactionsTableProps {
  transactions: RecentTransactionRow[];
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-black/10">
        <p className="text-sm text-black/40">No recent transactions to display</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusTone = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'confirmed': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <div className="border border-black overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black text-white text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="text-left py-4 px-6">Transaction</th>
              <th className="text-left py-4 px-6">Customer</th>
              <th className="text-center py-4 px-6">Status</th>
              <th className="text-left py-4 px-6">Method</th>
              <th className="text-right py-4 px-6">Amount</th>
              <th className="text-right py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-black/3 transition-colors group">
                <td className="py-4 px-6">
                  <p className="font-black text-xs uppercase tracking-tight">#{tx.id}</p>
                  <p className="text-[10px] text-black/40 font-medium">
                    {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-black/5 flex items-center justify-center border border-black/10">
                      {tx.customerType === 'registered' ? <UserCheck className="h-4 w-4" /> : <User className="h-4 w-4 text-black/30" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{tx.customerLabel}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-black/30">{tx.customerType}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <AdminStatusBadge label={tx.status} tone={getStatusTone(tx.status)} />
                </td>
                <td className="py-4 px-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/60 bg-black/5 px-2 py-1 inline-block">
                    {tx.paymentMethod.replace('_', ' ')}
                  </p>
                </td>
                <td className="py-4 px-6 text-right">
                  <p className="font-integral font-black text-sm">{formatCurrency(tx.totalPrice)}</p>
                </td>
                <td className="py-4 px-6 text-right">
                  <Link 
                    href={`/admin/orders/${tx.id}`}
                    className="inline-flex items-center justify-center h-8 w-8 border border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
