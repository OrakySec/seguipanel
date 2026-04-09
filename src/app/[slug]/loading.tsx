export default function SlugLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />

      {/* Hero */}
      <div className="flex flex-col items-center gap-4 py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="w-48 h-8 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="w-72 h-4 bg-gray-100 rounded-full animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-5xl mx-auto w-full px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-3 animate-pulse">
              <div className="w-2/3 h-4 bg-gray-100 rounded-full" />
              <div className="w-1/2 h-3 bg-gray-100 rounded-full" />
              <div className="mt-2 w-full h-10 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
