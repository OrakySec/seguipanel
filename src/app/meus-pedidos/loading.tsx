export default function MeusPedidosLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />

      <div className="max-w-2xl mx-auto w-full px-4 py-16 flex flex-col gap-4">
        <div className="w-40 h-6 bg-gray-100 rounded-full animate-pulse mx-auto" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 animate-pulse">
            <div className="flex justify-between">
              <div className="w-20 h-4 bg-gray-100 rounded-full" />
              <div className="w-16 h-6 bg-gray-100 rounded-full" />
            </div>
            <div className="w-1/2 h-3 bg-gray-100 rounded-full" />
            <div className="w-full h-2 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
