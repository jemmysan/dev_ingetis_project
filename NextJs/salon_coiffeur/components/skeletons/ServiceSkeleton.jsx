export const ServiceSkeleton = () => (
  <div className="border border-gray-200 shadow rounded-lg p-4 max-w-sm w-full mx-auto">
    <div className="animate-pulse flex flex-col space-y-4">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        <div className="h-3 bg-gray-300 rounded w-4/6"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded w-full mt-4"></div>
    </div>
  </div>
);