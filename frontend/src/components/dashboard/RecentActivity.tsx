import { formatRelativeTime } from '@utils/dateUtils';
import type { RecentActivity as Activity } from '@types/dashboard.types';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface RecentActivityProps {
  activities: Activity[];
  maxItems?: number;
}

const RecentActivity = ({ activities, maxItems = 10 }: RecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      connection_added: '🤝',
      challenge_completed: '🏆',
      score_updated: '📊',
      recommendation_applied: '✅',
      badge_earned: '🎖️',
      streak_milestone: '🔥',
      report_generated: '📄',
    };
    return icons[type] || '🌀';
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      connection_added: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
      challenge_completed: 'border-green-500 bg-green-50 dark:bg-green-900/10',
      score_updated: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
      recommendation_applied: 'border-purple-500 bg-purple-50 dark:bg-purple-900/10',
      badge_earned: 'border-orange-500 bg-orange-50 dark:bg-orange-900/10',
      streak_milestone: 'border-pink-500 bg-pink-50 dark:bg-pink-900/10',
      report_generated: 'border-gray-500 bg-gray-50 dark:bg-gray-900/10',
    };
    return colors[type] || 'border-gray-500 bg-gray-50 dark:bg-gray-900/10';
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          <Clock size={20} className="text-gray-600 dark:text-gray-400" />
          <span>Recent Activity</span>
        </h3>
        {activities.length > maxItems && (
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All ({activities.length})
          </button>
        )}
      </div>

      {/* No Activity */}
      {displayActivities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="font-medium mb-2">No recent activity</p>
          <p className="text-sm">Connect a social media account to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start space-x-3 p-4 rounded-lg border-l-4 ${getActivityColor(
                activity.type
              )} hover:shadow-md transition-all cursor-pointer`}
            >
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>

              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {activity.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 space-x-1">
                  <p>{formatRelativeTime(activity.timestamp)}</p>
                  {activity.metadata?.platform && (
                    <span>• {activity.metadata.platform}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
