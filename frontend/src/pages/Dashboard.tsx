import { useContext } from 'react';
import { DashboardContext } from '@context/DashboardContext';
import RiskScoreCard from '@components/dashboard/RiskScoreCard';
import QuickStats from '@components/dashboard/QuickStats';
import RecentActivity from '@components/dashboard/RecentActivity';
import ConnectionsOverview from '@components/dashboard/ConnectionsOverview';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { dashboardData, loading, error, refreshDashboard } = useContext(DashboardContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-center space-y-4">
        <p className="text-red-500 text-lg font-medium">Error: {error}</p>
        <button
          onClick={refreshDashboard}
          className="btn btn-primary px-4 py-2 rounded-md shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your privacy overview.
          </p>
        </div>

        <button
          onClick={refreshDashboard}
          className="btn btn-secondary flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score */}
        <RiskScoreCard
          score={dashboardData.risk_score.overall_score}
          category={dashboardData.risk_score.category}
          trend={dashboardData.risk_score.trend}
          lastUpdated={dashboardData.risk_score.last_updated}
        />

        {/* Quick Stats */}
        <QuickStats
          totalConnections={dashboardData.quick_stats.total_connections}
          activeConnections={dashboardData.quick_stats.active_connections}
          completedChallenges={dashboardData.quick_stats.completed_challenges}
          currentStreak={dashboardData.quick_stats.current_streak}
          pointsEarned={dashboardData.quick_stats.points_earned}
        />
      </div>

      {/* Activity + Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={dashboardData.recent_activity} />
        <ConnectionsOverview data={dashboardData.connections_overview} />
      </div>
    </div>
  );
};

export default Dashboard;
