
export function OrderCardSkeleton() {
  return (
    <div className="border border-black bg-white animate-pulse">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-black pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 shrink-0" />
            <div className="space-y-2">
              <div className="h-2 w-24 bg-gray-100" />
              <div className="h-6 w-32 bg-gray-200" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="flex flex-col space-y-2">
              <div className="h-2 w-16 bg-gray-100" />
              <div className="h-4 w-24 bg-gray-200" />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="h-2 w-16 bg-gray-100" />
              <div className="h-4 w-24 bg-gray-200" />
            </div>

            <div className="sm:ml-4">
              <div className="h-10 w-24 border border-black bg-gray-50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-black/5 bg-gray-50/50">
              <div className="w-16 h-16 bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200" />
                <div className="h-3 w-1/2 bg-gray-100" />
              </div>
              <div className="h-4 w-8 bg-gray-200" />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end pt-4 border-t border-black/5">
            <div className="h-10 w-32 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function OrdersSkeleton() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </>
  );
}
