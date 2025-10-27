import { api } from './api'
import type {
  DashboardData,
  RiskScore,
  QuickStats,
  RecentActivity,
} from '@types/dashboard.types'

class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    return api.get<DashboardData>('/dashboard')
  }

  async getRiskScore(): Promise<RiskScore> {
    return api.get<RiskScore>('/dashboard/risk-score')
  }

  async getQuickStats(): Promise<QuickStats> {
    return api.get<QuickStats>('/dashboard/stats')
  }

  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    return api.get<RecentActivity[]>(`/dashboard/activity?limit=${limit}`)
  }

  async refreshRiskScore(): Promise<RiskScore> {
    return api.post<RiskScore>('/dashboard/risk-score/refresh')
  }
}

export const dashboardService = new DashboardService()
