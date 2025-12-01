import { AppShell } from "@/components/layout/AppShell";
import { PrimaryNav } from "@/components/navigation/PrimaryNav";
import { MetricCard } from "@/components/cards/MetricCard";
import { TrendCard } from "@/components/cards/TrendCard";
import { ActivityTimeline } from "@/components/cards/ActivityTimeline";
import { ConnectionCard } from "@/components/cards/ConnectionCard";
import {
  ChartBarSquareIcon,
  ShieldCheckIcon,
  FireIcon
} from "@heroicons/react/24/outline";

const metricData = [
  {
    title: "Overall sentiment",
    value: "82",
    trend: "+4.1%",
    trendVariant: "up" as const,
    icon: <ShieldCheckIcon className="h-5 w-5 text-brand.teal" />,
    helper: "Across all connected surfaces"
  },
  {
    title: "Tracker requests blocked",
    value: "268",
    trend: "24h",
    trendVariant: "neutral" as const,
    icon: <FireIcon className="h-5 w-5 text-brand.amber" />,
    helper: "From 19 distinct vendors"
  },
  {
    title: "Sync latency",
    value: "312ms",
    trend: "-18%",
    trendVariant: "down" as const,
    icon: <ChartBarSquareIcon className="h-5 w-5 text-brand.blue" />,
    helper: "p95 across ingest pipelines"
  }
];

const trackerActivity = [
  {
    title: "linkedin.com",
    time: "2m ago",
    status: "positive" as const,
    description: "Auto-rotated API key per policy"
  },
  {
    title: "facebook.com/tr",
    time: "7m ago",
    status: "negative" as const,
    description: "Spike in pixel requests blocked"
  },
  {
    title: "twitter.com analytics",
    time: "13m ago",
    status: "neutral" as const,
    description: "Telemetry stream resumed"
  }
];

const connections = [
  { platform: "LinkedIn Analyst Workspace", status: "healthy" as const, lastSync: "2m ago", risk: 19 },
  { platform: "Meta Business Suite", status: "attention" as const, lastSync: "17m ago", risk: 44 },
  { platform: "X/Twitter Studio", status: "syncing" as const, lastSync: "Synchronising", risk: 27 }
];

const sparklinePoints = [68, 72, 70, 78, 74, 82, 79, 85, 83];

export default function Page() {
  return (
    <AppShell sidebar={<PrimaryNav />}>
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {metricData.map((metric) => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>
          <TrendCard
            title="Network sentiment"
            description="Composite score measured across connected surfaces"
            points={sparklinePoints}
          />
          <ActivityTimeline activities={trackerActivity} />
        </section>
        <section className="lg:col-span-4 space-y-4">
          {connections.map((connection) => (
            <ConnectionCard key={connection.platform} {...connection} />
          ))}
          <div className="glass-panel p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Automation</p>
            <h3 className="mt-2 text-lg text-white">Playbook queue</h3>
            <p className="mt-3 text-sm text-white/60">
              3 recipes are ready to activate. Applying them will reduce tracker exposure by estimated
              12%.
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-brand.purple to-brand.blue py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-90"
            >
              Review playbooks
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

