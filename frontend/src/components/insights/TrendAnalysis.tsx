import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface TrendAnalysisProps {
  trend: 'improving' | 'worsening' | 'stable'
  rateOfChange: number
  predictedScore7d?: number
  predictedScore30d?: number
  currentScore: number
}

const TrendAnalysis = ({
  trend,
  rateOfChange,
  predictedScore7d,
  predictedScore30d,
  currentScore,
}: TrendAnalysisProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="text-green-600" size={48} />
      case 'worsening':
        return <TrendingUp className="text-red-600" size={48} />
      case 'stable':
        return <Minus className="text-gray-600" size={48} />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'improving':
        return 'text-green-600'
      case 'worsening':
        return 'text-red-600'
      case 'stable':
        return 'text-gray-600'
    }
  }

  const getTrendBg = () => {
    switch (trend) {
      case 'improving':
        return 'bg-green-50 dark:bg-green-900/20'
      case 'worsening':
        return 'bg-red-50 dark:bg-red-900/20'
      case 'stable':
        return 'bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3>Trend Analysis</h3>

      <div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {getTrendIcon()}
        </motion.div>
        <div>
          <p>{trend}</p>
          <p>{Math.abs(rateOfChange).toFixed(2)} points per day</p>
          <p>
            {trend === 'improving'
              ? 'Your privacy is getting better! Keep it up.'
              : trend === 'worsening'
              ? 'Your privacy score is declining. Take action soon.'
              : 'Your privacy score is stable.'}
          </p>
        </div>
      </div>

      {(predictedScore7d !== undefined || predictedScore30d !== undefined) && (
        <div>
          <h4>
            <span>Predictions</span>
            <ArrowRight size={16} className="text-gray-400" />
          </h4>

          <div>
            {predictedScore7d !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p>In 7 days</p>
                <div>
                  <p>{predictedScore7d.toFixed(1)}</p>
                  <span
                    className={`${
                      predictedScore7d < currentScore
                        ? 'text-green-600'
                        : predictedScore7d > currentScore
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {predictedScore7d < currentScore
                      ? `↓ ${(currentScore - predictedScore7d).toFixed(1)}`
                      : predictedScore7d > currentScore
                      ? `↑ ${(predictedScore7d - currentScore).toFixed(1)}`
                      : '→ 0'}
                  </span>
                </div>
              </motion.div>
            )}

            {predictedScore30d !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p>In 30 days</p>
                <div>
                  <p>{predictedScore30d.toFixed(1)}</p>
                  <span
                    className={`${
                      predictedScore30d < currentScore
                        ? 'text-green-600'
                        : predictedScore30d > currentScore
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {predictedScore30d < currentScore
                      ? `↓ ${(currentScore - predictedScore30d).toFixed(1)}`
                      : predictedScore30d > currentScore
                      ? `↑ ${(predictedScore30d - currentScore).toFixed(1)}`
                      : '→ 0'}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default TrendAnalysis