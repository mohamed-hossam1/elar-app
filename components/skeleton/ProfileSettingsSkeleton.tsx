export default function ProfileSettingsSkeleton() {
  return (
    <div className="bg-white font-satoshi animate-pulse">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        
        <div className="mb-16">
          <div className="h-3 w-32 bg-black/5 rounded mb-8" />
          <div className="h-12 sm:h-20 w-64 bg-black/10 rounded-none mb-4" />
          <div className="h-2 w-20 bg-black/10" />
        </div>

        <div className="space-y-24">
          
          <div className="space-y-10">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-black/10" />
              <div className="h-4 w-64 bg-black/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-3 w-20 bg-black/5" />
                  <div className="h-14 w-full border border-black/10 bg-black/2" />
                </div>
              ))}
            </div>
            
            <div className="h-14 w-40 bg-black/10" />
          </div>

          
          <div className="space-y-10">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-black/10" />
              <div className="h-4 w-64 bg-black/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-3 w-20 bg-black/5" />
                  <div className="h-14 w-full border border-black/10 bg-black/2" />
                </div>
              ))}
            </div>
            
            <div className="h-14 w-40 bg-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
