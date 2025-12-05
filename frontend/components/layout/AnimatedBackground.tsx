export const AnimatedBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#111418]"
  >
    <div className="absolute inset-0 opacity-[0.18]">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <pattern id="subtle-grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#subtle-grid)" />
      </svg>
    </div>
    <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/[0.05] to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
  </div>
);

