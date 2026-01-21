export function SkeletonCard() {
  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-gray-900/50 rounded-lg border border-white/10 animate-pulse">
      <div className="p-4 border-b border-white/10">
        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10 animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
      <div className="h-64 bg-gray-700 rounded"></div>
    </div>
  );
}
