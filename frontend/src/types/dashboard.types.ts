export interface DashboardData {
  risk_score: RiskScore
  quick_stats: QuickStats
  recent_activity: RecentActivity[]
  connections_overview: ConnectionsOverview
}

export interface RiskScore {
  overall_score: number
  category: 'low' | 'medium' | 'high'
  breakdown: {
    privacy_settings: number
    post_frequency: number
    personal_info_exposure: number
    third_party_apps: number
  }
  last_updated: string
  trend: 'improving' | 'worsening' | 'stable'
}

export interface QuickStats {
  total_connections: number
  active_connections: number
  completed_challenges: number
  current_streak: number
  points_earned: number
}

export interface RecentActivity {
  id: number
  type:
    | 'connection_added'
    | 'challenge_completed'
    | 'score_updated'
    | 'recommendation_applied'
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface ConnectionsOverview {
  total: number
  by_platform: {
    platform: string
    count: number
  }[]
}

export interface TrendData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
  }[]
}

export interface PlatformBreakdown {
  platform: string
  connections: number
  risk_score: number
  percentage: number
}

export interface RiskHistory {
  date: string
  score: number
}
