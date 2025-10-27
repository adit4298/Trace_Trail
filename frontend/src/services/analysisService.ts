import { api } from './api'
import type {
  TrendData,
  PlatformBreakdown,
  RiskHistory,
} from '@types/dashboard.types'

class AnalysisService {
  async getTrendData(period: '7d' | '30d' | '90d' = '30d'): Promise<TrendData> {
    return api.get<TrendData>(`/analysis/trends?period=${period}`)
  }

  async getPlatformBreakdown(): Promise<PlatformBreakdown[]> {
    return api.get<PlatformBreakdown[]>('/analysis/platform-breakdown')
  }

  async getRiskHistory(days: number = 30): Promise<RiskHistory[]> {
    return api.get<RiskHistory[]>(`/analysis/risk-history?days=${days}`)
  }

  async generateReport(type: 'privacy' | 'summary'): Promise<Blob> {
    return api.get(`/analysis/report?type=${type}`, {
      responseType: 'blob',
    })
  }
}

export const analysisService = new AnalysisService()
