
export default function QuantityProductSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-40 bg-gray-200 mb-2"></div>
        <div className="h-4 w-24 bg-gray-100 mb-4"></div>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      <div>
        <div className="h-4 w-24 bg-gray-100 mb-4"></div>
        <div className="flex flex-wrap gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 border border-black/10" />
          ))}
        </div>
      </div>

      <div>
        <div className="h-4 w-20 bg-gray-100 mb-4"></div>
        <div className="flex flex-wrap gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-16 h-10 bg-gray-200 border border-black/10" />
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        <div className="flex items-center justify-between border border-black px-6 py-4 bg-white sm:w-40 h-14">
          <div className="w-6 h-6 bg-gray-100"></div>
          <div className="w-8 h-6 bg-gray-100"></div>
          <div className="w-6 h-6 bg-gray-100"></div>
        </div>

        <div className="hidden sm:block flex-1 h-14 bg-black opacity-10"></div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black p-4 z-[100] sm:hidden flex gap-4 items-center">
        <div className="flex flex-col pr-2 border-r border-black/10 min-w-[100px]">
          <div className="h-2 w-10 bg-gray-100 mb-1"></div>
          <div className="h-6 w-20 bg-gray-200"></div>
        </div>
        <div className="flex-1 h-14 bg-black opacity-10"></div>
      </div>
    </div>
  );
}
