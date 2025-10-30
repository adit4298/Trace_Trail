import { motion } from 'framer-motion'
import ActionButton from './ActionButton'
import ImpactIndicator from './ImpactIndicator'

interface RecommendationCardProps {
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  onAction: () => void
}

const RecommendationCard = ({
  title,
  description,
  impact,
  onAction,
}: RecommendationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
    >
      <h4 className="text-lg font-semibold mb-1">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{description}</p>
      <div className="flex items-center justify-between">
        <ImpactIndicator level={impact} />
        <ActionButton onClick={onAction} />
      </div>
    </motion.div>
  )
}

export default RecommendationCard