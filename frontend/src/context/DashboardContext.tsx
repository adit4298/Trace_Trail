import { createContext, useState, useEffect, ReactNode } from 'react'
import { dashboardService } from '@services/dashboardService'
import type { DashboardData } from '@types/dashboard.types'

interface DashboardContextType {
  dashboardData: DashboardData | null
  loading: boolean
  error: string | null
  refreshDashboard: () => Promise<void>
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
)

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dashboardService.getDashboardData()
      setDashboardData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const refreshDashboard = async () => {
    await fetchDashboard()
  }

  return (
    <DashboardContext.Provider value={{ dashboardData, loading, error, refreshDashboard }}>
      {children}
    </DashboardContext.Provider>
  )
}
