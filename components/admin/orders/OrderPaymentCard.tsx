"use client";

import { Order } from "@/types/Order";
import { AdminCard, AdminField, AdminNotice } from "@/components/admin/AdminUI";
import { formatAdminLabel } from "@/lib/admin";

export function OrderPaymentCard({ order }: { order: Order }) {
  return (
    <AdminCard className="space-y-4">
      <h3 className="font-integral text-sm font-black uppercase tracking-[0.08em] text-black border-b border-black/10 pb-3">
        Payment Details
      </h3>
      
      <div className="space-y-4 pt-1">
        <AdminField label="Method">
          <div className="text-sm font-medium">{formatAdminLabel(order.payment_method)}</div>
        </AdminField>

        <AdminField label="Payment Proof">
          {!order.payment_image ? (
            <AdminNotice tone="neutral">
              No payment proof provided.
            </AdminNotice>
          ) : order.payment_image.startsWith("http") ? (
            <div className="group relative aspect-video overflow-hidden border border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <img
                src={order.payment_image}
                alt="Payment proof"
                className="h-full w-full object-contain p-2"
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-black bg-black p-2 text-center opacity-0 transition-opacity group-hover:opacity-100">
                <a 
                  href={order.payment_image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest text-white hover:underline"
                >
                  View Full Size
                </a>
              </div>
            </div>
          ) : (
            <AdminNotice tone="warning" title="Legacy Record">
              Stored filename: <strong>{order.payment_image}</strong>
              <br />
              This is a legacy record. Only the filename was saved, and the actual image is not available in storage.
            </AdminNotice>
          )}
        </AdminField>
      </div>
    </AdminCard>
  );
}
