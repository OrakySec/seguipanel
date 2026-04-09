export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />

      {/* Hero skeleton */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-24">
        <div className="w-40 h-5 bg-gray-100 rounded-full animate-pulse" />
        <div className="w-72 h-12 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="w-56 h-8 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="flex gap-3 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-24 h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
