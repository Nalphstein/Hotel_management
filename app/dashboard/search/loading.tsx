export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
      
      <div className="flex justify-center items-center h-48 sm:h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
}