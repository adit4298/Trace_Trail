import { ReactNode } from "react";
import { clsx } from "clsx";
import { SparklesIcon, BellIcon } from "@heroicons/react/24/outline";

interface AppShellProps {
  sidebar: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export function AppShell({ sidebar, topbar, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden xl:flex w-[260px] flex-col gap-6 border-r border-white/5 bg-background-accent/60 px-6 py-8 backdrop-blur-md">
        {sidebar}
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            {topbar ?? <DefaultTopbar />}
          </div>
        </header>
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function DefaultTopbar() {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand.purple to-brand.blue p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-[13px] bg-background-accent text-sm font-semibold tracking-wide text-white/90">
            TT
          </div>
        </div>
        <div>
          <p className="text-sm text-white/60">TraceTrail Experience</p>
          <h1 className="text-lg font-semibold text-white">Design reference system</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={clsx(
            "group flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition",
            "hover:border-white/30 hover:text-white"
          )}
        >
          <SparklesIcon className="h-4 w-4 text-brand.purple" />
          Generate insights
        </button>
        <button
          type="button"
          className="relative rounded-full border border-white/10 p-2 text-white/70 transition hover:border-white/30 hover:text-white"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5 rounded-full bg-brand.amber ring-2 ring-background" />
        </button>
      </div>
    </>
  );
}

