import 'server-only';

import type { DashboardSnapshot } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
};

export async function fetchJson<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { revalidate, tags, ...rest } = options;
  const url = resolveUrl(endpoint);

  const response = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers ?? {})
    },
    cache: rest.cache ?? 'no-store',
    next:
      typeof revalidate !== 'undefined' || (tags && tags.length)
        ? {
            revalidate,
            tags
          }
        : undefined
  });

  if (!response.ok) {
    throw new Error(await toErrorMessage(response));
  }

  return response.json() as Promise<T>;
}

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!API_BASE_URL) {
    return mockDashboardSnapshot;
  }

  const dashboardSummaryUrl = `${API_BASE_URL}/dashboard/summary`;

  try {
    return await fetchJson<DashboardSnapshot>(dashboardSummaryUrl, {
      cache: 'force-cache',
      revalidate: 60,
      tags: ['dashboard']
    });
  } catch (error) {
    console.warn('[lib/api] Falling back to mock dashboard payload', error);
    return mockDashboardSnapshot;
  }
}

function resolveUrl(endpoint: string): string {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }

  if (!API_BASE_URL) {
    throw new Error('Set NEXT_PUBLIC_API_URL to call backend endpoints.');
  }

  return `${API_BASE_URL}${endpoint}`;
}

async function toErrorMessage(response: Response) {
  try {
    const data = await response.json();
    return data?.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

const mockDashboardSnapshot: DashboardSnapshot = {
  navigation: [
    { id: 'overview', label: 'Overview', href: '/', icon: 'overview' },
    { id: 'signals', label: 'Signals', href: '/signals', icon: 'signals', badge: 'Live' },
    { id: 'investigations', label: 'Investigations', href: '/investigations', icon: 'investigations' },
    { id: 'activity', label: 'Activity', href: '/activity', icon: 'activity' },
    { id: 'accounts', label: 'Accounts', href: '/dashboard/accounts', icon: 'accounts' },
    { id: 'reports', label: 'Reports', href: '/reports', icon: 'reports' },
    { id: 'security', label: 'Security', href: '/security', icon: 'security' },
    { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings' }
  ],
  notifications: 4,
  user: {
    name: 'Taylor Quinn',
    title: 'Director of Trust & Safety',
    organization: 'TraceTrail Labs',
    avatarUrl: 'https://avatars.githubusercontent.com/u/9919'
  },
  metrics: [
    {
      id: 'risk-score',
      label: 'Risk Score',
      value: '23.4',
      change: -5.8,
      trend: 'down',
      target: 30,
      progress: 0.67,
      annotation: 'Lower is better',
      status: 'Stable'
    },
    {
      id: 'signals',
      label: 'Signals Processed',
      value: '142k',
      change: 12.4,
      trend: 'up',
      target: 150000,
      progress: 0.94,
      status: 'Trending upward'
    },
    {
      id: 'coverage',
      label: 'Network Coverage',
      value: '86%',
      change: 2.1,
      trend: 'up',
      target: 0.95,
      progress: 0.86,
      status: 'Strong coverage'
    },
    {
      id: 'alerts',
      label: 'Critical Alerts',
      value: '12',
      change: 1.5,
      trend: 'flat',
      target: 10,
      progress: 0.8,
      annotation: 'Investigations open',
      status: 'Escalations active'
    }
  ],
  trends: {
    title: 'Anomaly Volume',
    subtitle: 'Last 14 days',
    unit: 'cases',
    data: [
      { timestamp: '2024-11-16', value: 22 },
      { timestamp: '2024-11-17', value: 24 },
      { timestamp: '2024-11-18', value: 19 },
      { timestamp: '2024-11-19', value: 27 },
      { timestamp: '2024-11-20', value: 31 },
      { timestamp: '2024-11-21', value: 28 },
      { timestamp: '2024-11-22', value: 26 },
      { timestamp: '2024-11-23', value: 33 },
      { timestamp: '2024-11-24', value: 35 },
      { timestamp: '2024-11-25', value: 29 },
      { timestamp: '2024-11-26', value: 32 },
      { timestamp: '2024-11-27', value: 37 },
      { timestamp: '2024-11-28', value: 34 },
      { timestamp: '2024-11-29', value: 31 }
    ]
  },
  activities: [
    {
      id: 'act-1',
      actor: 'Phoenix Monitor',
      action: 'Flagged suspicious login spike in APAC region',
      timestamp: new Date().toISOString(),
      state: 'critical',
      context: 'Escalated to Tier 2, MFA failure rate 41%'
    },
    {
      id: 'act-2',
      actor: 'Signal Copilot',
      action: 'Auto-resolved 38 benign anomalies',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      state: 'success',
      context: 'ML confidence 93%'
    },
    {
      id: 'act-3',
      actor: 'Trust Graph',
      action: 'New high-signal connection from Finance Cloud',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      state: 'info',
      context: 'Vetted by policy team'
    },
    {
      id: 'act-4',
      actor: 'Analyst Team',
      action: 'Opened investigation INV-9481 for persistent anomaly',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      state: 'warning',
      context: 'SLA 2h remaining'
    }
  ],
  connections: [
    {
      id: 'conn-1',
      name: 'Helix Banking',
      title: 'Core Payments',
      organization: 'Helix',
      avatarUrl: 'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=facearea&w=200&h=200&q=80',
      trustScore: 92,
      isOnline: true,
      lastActive: new Date().toISOString()
    },
    {
      id: 'conn-2',
      name: 'Aurora Identity',
      title: 'Identity Graph',
      organization: 'Aurora',
      avatarUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&w=200&h=200&q=80',
      trustScore: 88,
      isOnline: false,
      lastActive: new Date(Date.now() - 1000 * 60 * 12).toISOString()
    },
    {
      id: 'conn-3',
      name: 'Lumen Retail',
      title: 'POS Telemetry',
      organization: 'Lumen',
      avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=200&h=200&q=80',
      trustScore: 79,
      isOnline: true,
      lastActive: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    }
  ]
};

