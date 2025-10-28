import { Users, Target, TrendingUp, Award, Activity } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { motion } from 'framer-motion';

interface QuickStatsProps {
  totalConnections: number;
  activeConnections: number;
  completedChallenges: number;
  currentStreak: number;
  pointsEarned?: number;
}

const QuickStats = ({
  totalConnections,
  activeConnections,
  completedChallenges,
  currentStreak,
  pointsEarned = 0,
}: QuickStatsProps) => {
  const stats = [
    {
      label: 'Total Connections',
      value: totalConnections,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      label: 'Active',
      value: activeConnections,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      label: 'Challenges',
      value: completedChallenges,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      label: 'Streak',
      value: currentStreak,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      suffix: ' days',
    },
    {
      label: 'Points',
      value: pointsEarned,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="card cursor-pointer hover:shadow-lg transition-shadow p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div
                className={`p-2 rounded-full ${stat.bgColor} flex items-center justify-center`}
              >
                <Icon className={stat.color} size={24} />
              </div>
              {stat.change && (
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>

            <div className="flex items-baseline gap-1">
              <AnimatedCounter
                value={stat.value}
                className="text-3xl font-bold text-gray-900 dark:text-white"
                duration={1500}
              />
              {stat.suffix && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.suffix}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickStats;
