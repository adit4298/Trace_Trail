import { Share2, ExternalLink } from 'lucide-react';
import type { ConnectionsOverview as OverviewType } from '@types/dashboard.types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ConnectionsOverviewProps {
  data: OverviewType;
}

const ConnectionsOverview = ({ data }: ConnectionsOverviewProps) => {
  const PLATFORM_COLORS: Record<string, { bg: string; text: string }> = {
    facebook: { bg: 'bg-blue-500', text: 'text-blue-600' },
    instagram: { bg: 'bg-pink-500', text: 'text-pink-600' },
    twitter: { bg: 'bg-sky-500', text: 'text-sky-600' },
    linkedin: { bg: 'bg-blue-700', text: 'text-blue-700' },
  };

  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
          <span>Connections Overview</span>
        </h3>
        <Link
          to="/connections"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1 font-medium"
        >
          <span>View All</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Total Overview */}
      <div className="text-center">
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-5xl font-bold text-gray-900 dark:text-white mb-1"
        >
          {data.total}
        </motion.p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Total Connected Platforms
        </p>
      </div>

      {/* No Connections */}
      {data.total === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-3">
            No connections yet
          </p>
          <Link to="/connections" className="btn btn-primary">
            Connect Platform
          </Link>
        </div>
      ) : (
        /* Platform Breakdown */
        <div className="space-y-4">
          {data.by_platform.map((platform, index) => {
            const colors = PLATFORM_COLORS[platform.platform] || {
              bg: 'bg-gray-500',
              text: 'text-gray-600',
            };
            const percentage = (platform.count / data.total) * 100;

            return (
              <div key={platform.platform}>
                {/* Label Row */}
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-3 h-3 rounded-full ${colors.bg}`}
                      title={platform.platform}
                    ></span>
                    <span className="capitalize text-sm font-medium text-gray-800 dark:text-gray-200">
                      {platform.platform}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{percentage.toFixed(0)}%</span>
                    <span className="font-medium">{platform.count}</span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-2.5 rounded-full ${colors.bg}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConnectionsOverview;
