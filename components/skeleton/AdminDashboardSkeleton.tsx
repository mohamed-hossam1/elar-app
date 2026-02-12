export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-48 bg-white border border-black/10 p-6 flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-3 w-24 bg-black/5 rounded-none" />
          <div className="h-8 w-48 bg-black/10 rounded-none" />
          <div className="h-3 w-80 bg-black/5 rounded-none" />
        </div>
        <div className="h-12 w-64 bg-black/5 border border-black/10" />
      </div>

      <div className="space-y-4">
        <div className="h-4 w-32 bg-black/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white border border-black/10" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 h-[400px] bg-white border border-black/10" />
        <div className="h-[400px] bg-white border border-black/10" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="h-[300px] bg-white border border-black/10" />
        <div className="h-[300px] bg-white border border-black/10" />
      </div>

      <div className="h-[400px] bg-white border border-black/10" />
    </div>
  );
}
