import { notFound } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { fetchDashboardSnapshot } from '@/lib/api';

type Tone = 'positive' | 'negative' | 'neutral';

interface SectionConfig {
  title: string;
  description: string;
  highlights: Array<{
    id: string;
    label: string;
    value: string;
    delta?: string;
    tone?: Tone;
    detail?: string;
  }>;
  insights: Array<{
    title: string;
    description: string;
  }>;
  checklist: string[];
}

const SECTION_CONTENT: Record<string, SectionConfig> = {
  signals: {
    title: 'Signals',
    description:
      'Friendly pulse on the events TraceTrail monitored for you today. Use this view to understand volume, accuracy, and freshness.',
    highlights: [
      { id: 'volume', label: 'Signals processed', value: '142k', delta: '+12.4%', tone: 'positive', detail: 'vs yesterday' },
      { id: 'precision', label: 'Precision', value: '98.2%', delta: '+1.3%', tone: 'positive', detail: 'Model confidence' },
      { id: 'latency', label: 'Avg. latency', value: '420 ms', delta: '-75 ms', tone: 'positive', detail: 'End-to-end' }
    ],
    insights: [
      {
        title: 'Morning sync',
        description: 'All regions synced on schedule. APAC produced 38% of today’s insights thanks to holiday shopping traffic.'
      },
      {
        title: 'Auto-labeling',
        description: 'Signal Copilot re-labeled 1.2k benign anomalies. You can lighten analyst load by enabling digest mode.'
      },
      {
        title: 'Data freshness',
        description: 'Two partner feeds briefly lagged by ~3 minutes. System caught up automatically, but we flagged for visibility.'
      }
    ],
    checklist: [
      'Share signal highlights with teammates via the daily digest.',
      'Skim the “new sources” tab to approve incoming feeds.',
      'Review auto-labeling suggestions before the weekend.'
    ]
  },
  investigations: {
    title: 'Investigations',
    description:
      'Simple overview of open cases and recent escalations so you can keep tabs on what needs human attention.',
    highlights: [
      { id: 'open', label: 'Open investigations', value: '37', delta: '-5 vs yesterday', tone: 'positive' },
      { id: 'sla', label: 'SLA at risk', value: '3', delta: '+1 case', tone: 'negative', detail: 'Requires a quick review' },
      { id: 'auto', label: 'Auto-resolved (24h)', value: '112', delta: '+22%', tone: 'positive' }
    ],
    insights: [
      {
        title: 'Escalations',
        description: 'Phoenix Monitor nudged three “High Risk” login clusters to Tier 2. They are waiting in your queue.'
      },
      {
        title: 'People bandwidth',
        description: 'Average investigator queue time is 18 minutes—well within the comfortable range this week.'
      },
      {
        title: 'Recommendations',
        description: 'Consider pairing new analysts with automation traces so they learn why certain cases close themselves.'
      }
    ],
    checklist: [
      'Double-check the few items with SLA warnings.',
      'Document any manual overrides you applied today.',
      'Celebrate the auto-resolved wins with your team!'
    ]
  },
  insights: {
    title: 'Strategic Insights',
    description:
      'Quantitative breakdown of signal quality, data freshness, and anomaly velocity. Use this space to explain why the dashboard is trending up or down.',
    highlights: [
      { id: 'precision', label: 'Signal precision', value: '98.2%', delta: '+1.3%', tone: 'positive', detail: 'vs last 7 days' },
      { id: 'coverage', label: 'Network coverage', value: '86%', delta: '+2.1%', tone: 'positive', detail: 'Global footprint' },
      { id: 'latency', label: 'Pipeline latency', value: '420 ms', delta: '-75 ms', tone: 'positive', detail: 'P95 end-to-end' }
    ],
    insights: [
      {
        title: 'Model refresh',
        description:
          'Risk Scorer retrained on 1.2M labeled events this week. Expect tighter thresholds in APAC fraud flows.'
      },
      {
        title: 'Emerging segments',
        description:
          'Consumer fintech partners contributed 38% of new anomalies. Coordinate with GTM to review onboarding guardrails.'
      },
      {
        title: 'Data quality watchlist',
        description:
          'Two telemetry feeds reported 4% null rates overnight. Auto-healing active, but keep an eye on trend lines.'
      }
    ],
    checklist: [
      'Share weekly KPI digest with leadership.',
      'Validate anomaly attribution notes before EOD.',
      'Review auto-tuned thresholds before publishing next release.'
    ]
  },
  activity: {
    title: 'Operational Activity',
    description:
      'Monitor open investigations, automation throughput, and SLA timers for Tier 1 teams. Keeps everyone on the same cadence.',
    highlights: [
      { id: 'open-cases', label: 'Open investigations', value: '37', delta: '-5 vs yesterday', tone: 'positive' },
      { id: 'sla', label: 'SLA at risk', value: '3', delta: '+1 case', tone: 'negative', detail: 'Requires escalation' },
      { id: 'auto-resolved', label: 'Auto-resolved (24h)', value: '112', delta: '+22%', tone: 'positive' }
    ],
    insights: [
      {
        title: 'Escalations',
        description:
          'Phoenix Monitor pushed three APAC payment clusters to Tier 2. Cross-region bridge scheduled for 16:00 UTC.'
      },
      {
        title: 'Automation coverage',
        description:
          'Signal Copilot handled 78% of benign anomalies this morning—highest rate this quarter. Confirm guardrails stay conservative.'
      },
      {
        title: 'Human bandwidth',
        description:
          'Investigator queue time averages 18 minutes. Continue pairing new hires with automation traces to shorten ramp-up.'
      }
    ],
    checklist: [
      'Double-check SLA timers on INV-9481 and INV-9520.',
      'Document manual overrides applied during EU peak.',
      'Review auto-resolve tuning with policy by Friday.'
    ]
  },
  connections: {
    title: 'Partner Connections',
    description:
      'Health of ingested partner feeds, trust posture, and last-seen telemetry. Useful for ops, compliance, and CS teams.',
    highlights: [
      { id: 'partners', label: 'Active partners', value: '58', delta: '+4 new', tone: 'positive' },
      { id: 'trust', label: 'Avg. trust score', value: '91', delta: '+2 pts', tone: 'positive' },
      { id: 'offline', label: 'Offline feeds', value: '2', delta: 'Helix EU / NovaPay', tone: 'negative' }
    ],
    insights: [
      {
        title: 'Helix Banking',
        description: 'EU telemetry paused for maintenance. ETA 3h. System automatically throttled downstream enrichment.'
      },
      {
        title: 'Aurora Identity',
        description: 'New enrichment attributes live (device lineage, session depth). Monitor for payload changes.'
      },
      {
        title: 'Partner outreach',
        description: 'Quarterly trust review scheduled next Tuesday. Provide anomaly summaries per partner beforehand.'
      }
    ],
    checklist: [
      'Verify offline feeds resume before Asia trading window.',
      'Sync with partnerships on onboarding pipeline capacity.',
      'Export trust score trendlines for compliance briefing.'
    ]
  },
  reports: {
    title: 'Reports & Dashboards',
    description:
      'Curate briefing packs, executive scorecards, and cross-functional exports. Track which narratives need updates.',
    highlights: [
      { id: 'exec-pack', label: 'Exec pack status', value: 'On track', delta: 'Deliver by Thu', tone: 'neutral' },
      { id: 'datasets', label: 'Datasets refreshed', value: '12 / 14', delta: '2 pending', tone: 'neutral' },
      { id: 'audits', label: 'Audit items', value: '0 blocking', delta: 'All controls pass', tone: 'positive' }
    ],
    insights: [
      {
        title: 'Narrative focus',
        description:
          'Highlight the 12.4% increase in signals processed and the impact on automation coverage in this week’s board memo.'
      },
      {
        title: 'Data exports',
        description:
          'Finance requested a redacted anomaly feed for Q4 close. Mask user identifiers per policy before handoff.'
      },
      {
        title: 'Visualization backlog',
        description:
          'Latency breakdown chart needs mobile-friendly layout before the sales kickoff. Target completion tomorrow.'
      }
    ],
    checklist: [
      'Lock KPIs for the weekly executive deck.',
      'Schedule data QA review once remaining datasets refresh.',
      'Coordinate with design on new “risk posture” visualization.'
    ]
  },
  security: {
    title: 'Security & Compliance',
    description:
      'Live view of policy enforcement, exposure windows, and audit tasks. Gives security leads a single source of truth.',
    highlights: [
      { id: 'policies', label: 'Policies enforced', value: '42', delta: '+3 new', tone: 'positive' },
      { id: 'exemptions', label: 'Active exemptions', value: '5', delta: 'Review monthly', tone: 'neutral' },
      { id: 'alerts', label: 'Critical alerts', value: '12', delta: '+1.5%', tone: 'negative', detail: 'See Incident #3412' }
    ],
    insights: [
      {
        title: 'Zero trust posture',
        description:
          'Network segmentation rollout at 86% completion. Remaining scopes require vendor buy-in—track in Jira SEC-224.'
      },
      {
        title: 'Playbook drift',
        description:
          'Two incident runbooks reference deprecated tooling. Update before next compliance spot check.'
      },
      {
        title: 'Key risk indicator',
        description:
          'Account takeover attempts down 5.8%, but credential-stuffing spikes from LATAM noted. Align with SOC for joint response.'
      }
    ],
    checklist: [
      'Finalize documentation for SOC 2 evidence locker.',
      'Re-run red team scenarios against new access policies.',
      'Confirm security headers + CSP in staging before release.'
    ]
  },
  settings: {
    title: 'Workspace Settings',
    description:
      'Admin controls for environments, integrations, and notification policies. Use to keep TraceTrail aligned with your org defaults.',
    highlights: [
      { id: 'environments', label: 'Environments', value: 'Prod · Staging · Sandbox', tone: 'neutral' },
      { id: 'integrations', label: 'Connected tools', value: 'Slack, PagerDuty, Jira', tone: 'neutral' },
      { id: 'roles', label: 'Role templates', value: 'Analyst, Engineer, Viewer', tone: 'neutral' }
    ],
    insights: [
      {
        title: 'Notification hygiene',
        description:
          'Tier 1 analysts receive ~45 alerts/day. Use digest mode for low priority signals to cut noise by 30%.'
      },
      {
        title: 'Integration status',
        description:
          'PagerDuty webhook rotated yesterday. Confirm incident routing still lands in the correct escalation chain.'
      },
      {
        title: 'Access provisioning',
        description:
          'New “Partner Viewer” role awaits legal approval. Document scopes and default retention before enabling.'
      }
    ],
    checklist: [
      'Audit API keys and rotate anything older than 90 days.',
      'Review SSO mapping for new departments.',
      'Tag stale integrations for removal during next sprint.'
    ]
  }
};

const toneStyles: Record<Tone, string> = {
  positive: 'text-success bg-success/15',
  negative: 'text-danger bg-danger/15',
  neutral: 'text-muted bg-surface/60'
};

export function generateStaticParams() {
  return Object.keys(SECTION_CONTENT).map((section) => ({ section }));
}

export default async function SectionPage({ params }: { params: { section: string } }) {
  const sectionKey = params.section?.toLowerCase();
  const config = SECTION_CONTENT[sectionKey];
  const snapshot = await fetchDashboardSnapshot();

  if (!config) {
    notFound();
  }

  return (
    <AppShell navItems={snapshot.navigation} notifications={snapshot.notifications} user={snapshot.user}>
      <section aria-label={`${config.title} overview`} className="space-y-4 rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-muted">Workspace</p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{config.title}</h1>
            <p className="mt-2 text-sm text-muted">{config.description}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Auto-updated every 15 minutes
          </span>
        </div>
      </section>

      <section aria-label="Key highlights" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {config.highlights.map((highlight) => (
          <article
            key={highlight.id}
            className="rounded-2xl border border-border/60 bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{highlight.label}</p>
              {highlight.delta ? (
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${toneStyles[highlight.tone ?? 'neutral']}`}>
                  {highlight.delta}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-3xl font-semibold text-foreground">{highlight.value}</p>
            {highlight.detail ? <p className="mt-1 text-xs text-muted">{highlight.detail}</p> : null}
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <header className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Narrative</p>
              <h2 className="text-lg font-semibold text-foreground">What to know</h2>
            </div>
            <span className="text-xs font-medium text-muted">{new Date().toLocaleDateString()}</span>
          </header>
          <div className="space-y-4">
            {config.insights.map((insight) => (
              <div key={insight.title} className="rounded-xl border border-border/40 bg-background/70 p-4">
                <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                <p className="mt-1 text-sm text-muted">{insight.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-wide text-muted">Next actions</p>
            <h2 className="text-lg font-semibold text-foreground">Team checklist</h2>
          </header>
          <ul className="space-y-3">
            {config.checklist.map((item, index) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <p className="text-sm text-foreground">{item}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </AppShell>
  );
}


