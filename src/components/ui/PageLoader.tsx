export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[99998] flex flex-col items-center justify-center"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Spinner */}
      <div className="relative mb-6">
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "9999px",
            border: "3px solid transparent",
            borderTopColor: "#7c4dff",
            borderRightColor: "#fb24b1",
            animation: "spin 0.75s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #fb24b1, #7c4dff)",
            }}
          />
        </div>
      </div>

      {/* Barra de progresso animada (indeterminada) */}
      <div
        style={{
          width: 200,
          height: 4,
          borderRadius: 9999,
          background: "rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "40%",
            background: "linear-gradient(to right, #fb24b1, #7c4dff)",
            borderRadius: 9999,
            animation: "slide 1.2s ease-in-out infinite",
            boxShadow: "0 0 8px rgba(124,77,255,0.5)",
          }}
        />
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(150%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
