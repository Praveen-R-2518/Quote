import { CheckCircle2, MapPin, Plane, TrendingUp } from "lucide-react";

/**
 * Decorative, illustration-free hero graphic: gradient blobs, a dashed flight
 * route, location markers, and two floating "product" glass cards. Pure
 * markup + CSS — no external image assets required.
 */
export function HeroVisual() {
  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-md select-none sm:max-w-lg"
      aria-hidden="true"
    >
      {/* Gradient blobs */}
      <div className="animate-blob-drift absolute -top-10 right-2 h-56 w-56 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="animate-blob-drift absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl [animation-delay:2s]" />
      <div className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-[#0b1220]/[0.05] blur-3xl" />

      {/* Textured canvas */}
      <div className="dot-grid noise-fade absolute inset-6 rounded-[2rem] border border-black/[0.05] bg-white/50" />

      {/* Flight path */}
      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <path
          d="M 60 420 C 140 380, 120 260, 210 230 C 290 205, 280 120, 340 80"
          stroke="var(--pumpkin)"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeDasharray="6 8"
          strokeLinecap="round"
        />
      </svg>

      {/* Route markers */}
      <div className="absolute left-[13%] top-[82%] flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/90 px-2.5 py-1 text-[11px] font-medium text-navy shadow-sm">
        <MapPin className="h-3 w-3 text-orange-500" />
        Colombo
      </div>
      <div className="absolute left-[46%] top-[44%] flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/90 px-2.5 py-1 text-[11px] font-medium text-navy shadow-sm">
        <MapPin className="h-3 w-3 text-orange-500" />
        Sigiriya
      </div>
      <div className="absolute right-[10%] top-[13%] flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white shadow-lg">
        <Plane className="h-4 w-4 -rotate-45" />
      </div>

      {/* Floating quotation summary card */}
      <div
        style={{ "--tilt": "-4deg" } as React.CSSProperties}
        className="animate-float-slow absolute left-[6%] top-[8%] w-[62%] -rotate-3 rounded-2xl border border-black/[0.06] bg-white/95 p-4 shadow-[0_24px_48px_-16px_rgba(11,18,32,0.22)] backdrop-blur"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-tight text-navy">Quotation #1042</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            Ready
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-navy-soft/70">Total</p>
            <p className="text-lg font-bold text-navy">₹ 84,500</p>
          </div>
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
        </div>
      </div>

      {/* Floating export status card */}
      <div
        style={{ "--tilt": "3deg" } as React.CSSProperties}
        className="animate-float-slower absolute bottom-[10%] right-[4%] w-[58%] rotate-2 rounded-2xl border border-black/[0.06] bg-white/95 p-4 shadow-[0_24px_48px_-16px_rgba(11,18,32,0.22)] backdrop-blur"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-navy">Word & PDF exported</p>
            <p className="truncate text-[11px] text-navy-soft/70">Ready to send to client</p>
          </div>
        </div>
      </div>
    </div>
  );
}
