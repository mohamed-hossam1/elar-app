export default function CartSkeleton() {
  return (
    <div className="max-w-[1450px] px-3 md:px-5 m-auto mt-6 md:mt-12 mb-10 animate-pulse font-satoshi">
      
      <div className="mb-6 md:mb-10">
        <div className="h-8 md:h-10 w-48 md:w-64 bg-gray-200 mb-3"></div>
        <div className="h-4 md:h-5 w-32 bg-gray-100"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        
        <div className="w-full lg:flex-4">
          <div className="flex flex-row justify-between items-center mb-4 md:mb-6 gap-3">
            <div className="h-6 md:h-7 w-32 bg-gray-200"></div>
            <div className="h-4 w-20 bg-gray-100"></div>
          </div>

          <div className="border border-black bg-white">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-3 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b last:border-b-0">
                
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 border border-black/5 shrink-0"></div>

                <div className="flex-1 w-full">
                  
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="h-5 md:h-6 w-full max-w-[200px] bg-gray-200 mb-2"></div>
                      <div className="flex gap-4">
                        <div className="h-4 w-16 bg-gray-100"></div>
                        <div className="h-4 w-16 bg-gray-100"></div>
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 shrink-0"></div>
                  </div>

                  
                  <div className="flex flex-row items-center justify-between mt-4 md:mt-6 gap-3">
                    <div className="w-24 h-10 bg-white border border-black/10"></div>

                    <div className="text-right">
                      <div className="h-6 w-24 bg-gray-200 mb-1 ml-auto"></div>
                      <div className="h-4 w-16 bg-gray-100 ml-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <div className="h-4 w-32 bg-gray-100"></div>
          </div>
        </div>

        
        <div className="w-full lg:flex-2">
          <div className="bg-white border border-black p-6 sm:p-8 lg:sticky lg:top-24">
            <div className="h-7 md:h-8 w-40 bg-gray-200 mb-6"></div>

            <div className="mb-8">
              <div className="flex gap-3">
                <div className="flex-1 h-12 bg-white border border-black/10"></div>
                <div className="w-24 h-12 bg-black/5"></div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-gray-100"></div>
                <div className="h-5 w-24 bg-gray-200"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 bg-gray-100"></div>
                <div className="h-5 w-24 bg-gray-200"></div>
              </div>
              
              <div className="border-t border-gray-100 pt-6 mt-6">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-16 bg-gray-200"></div>
                  <div className="h-8 w-32 bg-gray-200"></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-14 w-full bg-black/5"></div>
              <div className="h-14 w-full bg-white border border-black/10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}