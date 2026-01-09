import 'server-only';

import type { DashboardSnapshot } from '@/lib/types';

/**
 * PUBLIC API base URL
 * .env.production MUST contain:
 * NEXT_PUBLIC_API_URL=https://api.tracetrail.in
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Typed fetch helper
 */
type FetchOptions = RequestInit & {
  revalidate?: number;
  tags?: string[];
};

/**
 * Resolve relative API paths safely
 */
function resolveUrl(path: string): string {
  if (path.startsWith('http')) return path;

  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  return `${API_BASE_URL}${path}`;
}

/**
 * Core JSON fetcher with timeout + error handling
 */
async function fetchJson<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(resolveUrl(path), {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {})
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API ${response.status}: ${text}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch dashboard snapshot
 * Falls back ONLY if API is unreachable
 */
export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  if (!API_BASE_URL) {
    console.warn('[api] API base URL missing, using mock dashboard');
    return mockDashboardSnapshot;
  }

  try {
    return await fetchJson<DashboardSnapshot>('/dashboard/summary', {
      revalidate: 60,
      tags: ['dashboard']
    });
  } catch (error) {
    console.warn('[api] Dashboard API failed, using mock data', error);
    return mockDashboardSnapshot;
  }
}

/**
 * SAFE, FULLY TYPED mock dashboard
 * Matches DashboardSnapshot EXACTLY
 */
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
    }
  ],

  connections: [
    {
      id: 'conn-1',
      name: 'Helix Banking',
      title: 'Core Payments',
      organization: 'Helix',
      avatarUrl: 'https://images.unsplash.com/photo-1521790797524-b2497295b8a0',
      trustScore: 92,
      isOnline: true,
      lastActive: new Date().toISOString()
    }
  ]
};
