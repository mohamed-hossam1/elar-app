export default function AdminPromoCodeListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="border border-black/10">
        <div className="grid grid-cols-[120px_1fr_100px_100px_100px] gap-4 p-4 border-b border-black/10 bg-black/5">
          {["Code", "Type", "Value", "Uses", "Actions"].map((h, i) => (
            <span key={i} className="text-[11px] font-black uppercase tracking-wider text-black/40">{h}</span>
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-[120px_1fr_100px_100px_100px] gap-4 p-4 border-b border-black/10">
            <div className="h-4 w-20 bg-black/10 rounded" />
            <div className="h-4 w-16 bg-black/10 rounded self-center" />
            <div className="h-4 w-16 bg-black/10 rounded self-center" />
            <div className="h-4 w-12 bg-black/10 rounded self-center" />
            <div className="flex gap-2 self-center">
              <div className="h-8 w-8 bg-black/10 rounded" />
              <div className="h-8 w-8 bg-black/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}