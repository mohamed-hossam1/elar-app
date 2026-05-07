import Orderitems from "./Orderitems";
import { Data } from "@/lib/data";
import { Order } from "@/types/Order";
import { Package, Calendar, Tag } from "lucide-react";
import { egpFormatter } from "@/lib/format/currency";

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-black bg-white group hover:bg-gray-50/50 transition-all duration-300">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-black pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-black/60 mb-1">
                Order Reference
              </p>
              <h3 className="text-xl font-black font-integral tracking-wider text-black">
                #{order.id}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-black/60 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Date
              </span>
              <p className="text-sm font-bold text-black uppercase tracking-wide">
                {Data(order?.created_at?.toString())?.["12h"]}
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-black/60 mb-1 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Total
              </span>
              <p className="text-sm font-black text-black">
                {egpFormatter.format(order.total_price)}
              </p>
            </div>

            <div className="sm:ml-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-black bg-white">
                <span className="text-xs font-black uppercase tracking-widest text-black">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Orderitems order={order} />
        </div>
      </div>
    </div>
  );
}
