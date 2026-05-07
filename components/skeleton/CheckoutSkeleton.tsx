export default function CheckoutSkeleton() {
  return (
    <div className="max-w-[1400px] px-4 sm:px-6 lg:px-8 m-auto mt-6 md:mt-12 mb-20 min-h-screen animate-pulse">
      <div className="mb-8 md:mb-12 space-y-4">
        <div className="h-12 w-64 bg-black/10 rounded-none" />
        <div className="h-4 w-48 bg-black/5 rounded-none" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        <div className="w-full lg:flex-[1.5] space-y-10">
          
          <section>
            <div className="h-8 w-48 bg-black/10 rounded-none mb-6" />
            <div className="border border-black rounded-none bg-white p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 bg-black/5" />
                    <div className="h-12 w-full border border-black/10 bg-black/2" />
                  </div>
                ))}
              </div>
              <div className="h-12 w-full border border-black/10 bg-black/2" />
            </div>
          </section>

          
          <section>
            <div className="h-8 w-48 bg-black/10 rounded-none mb-6" />
            <div className="border border-black rounded-none bg-white p-6 sm:p-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 w-full border border-black/10 bg-black/2" />
              ))}
            </div>
          </section>
        </div>

        
        <div className="w-full lg:flex-1">
          <div className="sticky top-28 space-y-6">
            <div className="border border-black rounded-none bg-white p-6 space-y-6">
              <div className="h-6 w-32 bg-black/10" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-black/5" />
                    <div className="h-4 w-16 bg-black/10" />
                  </div>
                ))}
              </div>
              <div className="border-t border-black pt-4 flex justify-between">
                <div className="h-6 w-20 bg-black/10" />
                <div className="h-6 w-24 bg-black/20" />
              </div>
            </div>
            <div className="h-14 w-full bg-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
