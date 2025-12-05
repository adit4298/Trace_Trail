export const AnimatedBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#030617] via-[#050f26] to-[#03121d]"
  >
    <div className="absolute inset-0 opacity-70">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(79,70,229,0.18),_transparent_60%)]" />
    </div>

    <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-[120px] animate-orb-slow" />
    <div className="absolute bottom-0 left-16 h-72 w-72 rounded-full bg-violet-500/20 blur-[110px] animate-orb-medium" />

    <div className="absolute inset-0 opacity-30">
      <div className="animate-wave-slow h-full w-[120%] -translate-x-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.07)_0%,_transparent_55%)] blur-3xl" />
    </div>

    <div className="absolute inset-0 opacity-10">
      <svg className="h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grid-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="url(#grid-gradient)" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  </div>
);


