export default function AdminLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ee_0%,#fdfdfc_28%,#ffffff_100%)] font-satoshi text-black animate-pulse">
      
      <aside className="hidden border-r border-black bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-72">
        <div className="flex h-full flex-col">
          <div className="border-b border-black px-6 py-6.5">
            <div className="h-3 w-24 bg-black/5 rounded mb-3" />
            <div className="h-8 w-40 bg-black/10 rounded" />
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 w-full border border-black/10 bg-black/5" />
            ))}
          </nav>

          <div className="border-t border-black px-6 py-6">
            <div className="border border-black/10 bg-[#f8f4ec] p-4 space-y-3">
              <div className="h-3 w-20 bg-black/5 rounded" />
              <div className="h-4 w-32 bg-black/10 rounded" />
              <div className="h-3 w-40 bg-black/5 rounded" />
            </div>
          </div>
        </div>
      </aside>

      
      <div className="lg:pl-72">
        <header className="border-b border-black bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="h-3 w-20 bg-black/5 rounded mb-3" />
                <div className="h-4 w-48 bg-black/10 rounded" />
              </div>

              <div className="flex items-center gap-3 border border-black bg-[#f8f4ec] px-4 py-3">
                <div className="h-10 w-10 border border-black bg-black/10" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-black/10 rounded" />
                  <div className="h-3 w-32 bg-black/5 rounded" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="space-y-8">
            <div className="h-[400px] w-full border-2 border-black/5 bg-black/2 rounded-sm" />
          </div>
        </main>
      </div>
    </div>
  );
}
