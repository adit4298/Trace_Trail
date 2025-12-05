export type MetricTrend = 'up' | 'down' | 'flat';

export interface MetricSummary {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: MetricTrend;
  target: number;
  progress: number; // 0-1 range
  annotation?: string;
  status?: string;
}

export interface TrendPoint {
  timestamp: string;
  value: number;
}

export interface TrendSeries {
  title: string;
  subtitle: string;
  unit: string;
  data: TrendPoint[];
}

export type ActivityState = 'success' | 'info' | 'warning' | 'critical';

export interface Activity {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  state: ActivityState;
  context: string;
}

export interface Connection {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatarUrl: string;
  trustScore: number;
  isOnline: boolean;
  lastActive: string;
}

export type IconName =
  | 'overview'
  | 'dashboard'
  | 'signals'
  | 'investigations'
  | 'insights'
  | 'activity'
  | 'connections'
  | 'reports'
  | 'security'
  | 'settings';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  badge?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  organization: string;
  avatarUrl: string;
}

export interface DashboardSnapshot {
  metrics: MetricSummary[];
  trends: TrendSeries;
  activities: Activity[];
  connections: Connection[];
  navigation: NavItem[];
  notifications: number;
  user: UserProfile;
}

