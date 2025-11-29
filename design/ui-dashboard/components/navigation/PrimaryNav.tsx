"use client";

import { Fragment } from "react";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Radar,
  Share2,
  LineChart,
  Sparkles
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Signals", icon: Radar },
  { label: "Connections", icon: Share2 },
  { label: "Reports", icon: LineChart },
  { label: "Automation", icon: Sparkles }
];

export function PrimaryNav() {
  return (
    <Fragment>
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Workspace</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Atlas Studio</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={clsx(
              "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
              label === "Overview"
                ? "bg-gradient-to-r from-white/10 to-white/5 text-white shadow-glow"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
            type="button"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-brand.purple/30 to-brand.blue/10 p-4 text-sm text-white/80">
        <p className="font-medium text-white">Workspace health</p>
        <p className="mt-2 text-xs text-white/60">
          Telemetry quality is stable. 3 new automations ready for review.
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-xl bg-white/10 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
        >
          Review now
        </button>
      </div>
    </Fragment>
  );
}

