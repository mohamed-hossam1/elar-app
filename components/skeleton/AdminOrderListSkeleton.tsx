export default function AdminOrderListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="border border-black/10">
        <div className="grid grid-cols-[80px_120px_1fr_100px_120px] gap-4 p-4 border-b border-black/10 bg-black/5">
          {["Order", "Date", "Customer", "Total", "Status"].map((h, i) => (
            <span key={i} className="text-[11px] font-black uppercase tracking-wider text-black/40">{h}</span>
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-[80px_120px_1fr_100px_120px] gap-4 p-4 border-b border-black/10">
            <div className="h-4 w-12 bg-black/10 rounded" />
            <div className="h-4 w-24 bg-black/10 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-black/10 rounded" />
              <div className="h-3 w-24 bg-black/5 rounded" />
            </div>
            <div className="h-4 w-16 bg-black/10 rounded self-center" />
            <div className="h-6 w-20 bg-black/10 rounded self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}