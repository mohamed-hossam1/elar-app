export default function AdminRankListSkeleton({ fullPage = false }: { fullPage?: boolean }) {
  const listContent = (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-2 border-black/5 p-4 rounded-sm">
          <div className="h-6 w-8 bg-black/5 rounded" />
          <div className="h-12 w-12 bg-black/10 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 bg-black/10 rounded" />
            <div className="h-3 w-1/4 bg-black/5 rounded" />
          </div>
          <div className="h-8 w-8 bg-black/5 rounded" />
        </div>
      ))}
    </div>
  );

  if (!fullPage) {
    return <div className="animate-pulse">{listContent}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-black/10 rounded" />
          <div className="h-4 w-96 bg-black/5 rounded" />
        </div>

        <div className="flex gap-3">
          <div className="h-12 w-32 border-2 border-black/10 bg-black/5" />
          <div className="h-12 w-40 border-2 border-black/20 bg-black/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]" />
        </div>
      </div>

      
      <div className="grid grid-cols-3 gap-2 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 w-full border-2 border-black/10 bg-black/5" />
        ))}
      </div>

      
      <div className="mb-8 space-y-2">
        <div className="h-3 w-32 bg-black/5 rounded" />
        <div className="h-12 w-full max-w-sm border-2 border-black/10 bg-black/5" />
      </div>

      {listContent}
    </div>
  );
}
