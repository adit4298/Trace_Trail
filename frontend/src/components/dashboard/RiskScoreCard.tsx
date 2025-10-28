import {
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { motion } from 'framer-motion';

interface RiskScoreCardProps {
  score: number;
  category: 'low' | 'medium' | 'high';
  trend: 'improving' | 'worsening' | 'stable';
  lastUpdated?: string;
}

const RiskScoreCard = ({ score, category, trend, lastUpdated }: RiskScoreCardProps) => {
  const getColor = () => {
    switch (category) {
      case 'low':
        return {
          text: 'text-green-600',
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-500',
          ring: 'ring-green-500/20',
          bar: 'bg-green-500',
        };
      case 'medium':
        return {
          text: 'text-yellow-600',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-500',
          ring: 'ring-yellow-500/20',
          bar: 'bg-yellow-500',
        };
      case 'high':
        return {
          text: 'text-red-600',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-500',
          ring: 'ring-red-500/20',
          bar: 'bg-red-500',
        };
    }
  };

  const getIcon = () => {
    const colors = getColor();
    switch (category) {
      case 'low':
        return <CheckCircle className={colors.text} size={48} />;
      case 'medium':
        return <AlertCircle className={colors.text} size={48} />;
      case 'high':
        return <XCircle className={colors.text} size={48} />;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="text-green-600" size={20} />;
      case 'worsening':
        return <TrendingUp className="text-red-600" size={20} />;
      case 'stable':
        return <Minus className="text-gray-600" size={20} />;
    }
  };

  const colors = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card ${colors.bg} border-l-4 ${colors.border} ring-4 ${colors.ring} flex flex-col gap-6`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Privacy Risk Score
          </h3>
          <span className={`capitalize ${colors.text}`}>{category} Risk</span>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {getIcon()}
        </motion.div>
      </div>

      <div className="flex items-baseline gap-2">
        <AnimatedCounter value={score} className={`text-6xl font-bold ${colors.text}`} />
        <span className="text-xl text-gray-500 dark:text-gray-400">/100</span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1 capitalize">
          {getTrendIcon()}
          <span>{trend}</span>
        </div>
        {lastUpdated && <span>Updated {lastUpdated}</span>}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>100</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-2 rounded-full ${colors.bar}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RiskScoreCard;
