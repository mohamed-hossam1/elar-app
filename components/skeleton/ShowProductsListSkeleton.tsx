import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";


export default function ShowProductsListSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="border border-black/10 rounded-[20px] p-6 space-y-8">
            <div className="h-6 bg-black/5 rounded w-1/2 mb-4" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-black/5 rounded w-full" />
            ))}
            <div className="pt-4 border-t border-black/10">
              <div className="h-6 bg-black/5 rounded w-1/3 mb-4" />
              <div className="h-10 bg-black/5 rounded w-full" />
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="mb-8">
            <div className="h-10 bg-black/5 rounded w-1/3 mb-2" />
            <div className="h-5 bg-black/5 rounded w-1/4" />
          </div>
          
          <ProductGridSkeleton />
        </main>
      </div>
    </div>
  );
}
