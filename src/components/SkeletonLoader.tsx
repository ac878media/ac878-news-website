export function PostCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl overflow-hidden shadow-md">
        <div className="aspect-video bg-gray-200"></div>
        <div className="p-5 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostCardSmallSkeleton() {
  return (
    <div className="animate-pulse flex gap-4 bg-white rounded-lg p-3">
      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-200 rounded-xl"></div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <PostCardSmallSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function CategorySectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-accent rounded-full"></div>
        <div className="space-y-1">
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <PostCardSkeleton />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <PostCardSmallSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewsTickerSkeleton() {
  return (
    <div className="bg-black py-2 overflow-hidden">
      <div className="flex items-center">
        <span className="bg-accent text-white px-3 py-1 text-sm font-bold flex-shrink-0">
          最新
        </span>
        <div className="flex animate-pulse ml-4 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-600 rounded w-48 flex-shrink-0"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
      
      <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}