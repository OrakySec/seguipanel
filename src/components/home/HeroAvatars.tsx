/**
 * 4 avatares inline (SVG). Zero requests, ~600 bytes total no HTML.
 * Substitui as 4 imagens do Unsplash que estavam marcadas como
 * priority + unoptimized e competiam pelo LCP.
 */

const GRADIENTS = [
  ["#fb24b1", "#7c4dff"],
  ["#fd5949", "#fb24b1"],
  ["#1877F2", "#7c4dff"],
  ["#0cc27e", "#1877F2"],
] as const;

function Avatar({ idx }: { idx: number }) {
  const [a, b] = GRADIENTS[idx];
  const id = `hero-av-${idx}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="16" fill={`url(#${id})`} />
      <circle cx="16" cy="13" r="5" fill="white" opacity="0.92" />
      <path
        d="M5 30c0-6 5-10 11-10s11 4 11 10z"
        fill="white"
        opacity="0.92"
      />
    </svg>
  );
}

export function HeroAvatars() {
  return (
    <div className="flex flex-shrink-0">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: 32,
            height: 32,
            borderRadius: 9999,
            border: "2px solid white",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: i,
            marginLeft: i === 0 ? 0 : -12,
            position: "relative",
          }}
        >
          <Avatar idx={i} />
        </div>
      ))}
    </div>
  );
}
