export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-16 bg-white border-b border-gray-100 animate-pulse" />

      <div className="max-w-5xl mx-auto w-full px-4 pt-8 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Formulário skeleton */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 animate-pulse">
              <div className="w-32 h-4 bg-gray-100 rounded-full" />
              <div className="w-full h-12 bg-gray-100 rounded-xl" />
              <div className="w-full h-12 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Resumo skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 animate-pulse">
            <div className="w-40 h-4 bg-gray-100 rounded-full" />
            <div className="w-full h-20 bg-gray-100 rounded-xl" />
            <div className="w-full h-12 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
