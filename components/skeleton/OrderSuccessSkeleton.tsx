export default function OrderSuccessSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-white border border-black p-6 sm:p-8 flex items-center gap-4">
          <div className="w-14 h-14 border border-black bg-black/10 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-64 bg-black/10" />
            <div className="h-4 w-32 bg-black/5" />
          </div>
          <div className="h-8 w-24 border border-black bg-black/5" />
        </div>

        
        <div className="bg-white border border-black p-6 sm:p-8">
          <div className="h-6 w-40 bg-black/10 mb-6" />
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-black/10 pb-4 last:border-b-0 last:pb-0">
                <div className="w-20 h-20 border border-black bg-black/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-black/10" />
                  <div className="h-3 w-24 bg-black/5" />
                  <div className="h-3 w-20 bg-black/5" />
                </div>
                <div className="h-8 w-24 border border-black bg-black/5" />
              </div>
            ))}
          </div>
        </div>

        
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-black p-6 sm:p-8 space-y-4">
              <div className="h-6 w-40 bg-black/10 mb-6" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-black/5" />
                <div className="h-4 w-3/4 bg-black/5" />
                <div className="h-4 w-1/2 bg-black/5" />
              </div>
            </div>
          ))}
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-4">
          <div className="h-14 w-48 border border-black bg-black/10" />
          <div className="h-14 w-48 border border-black bg-black/5" />
        </div>
      </div>
    </div>
  );
}
