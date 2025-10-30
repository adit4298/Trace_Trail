import { motion } from 'framer-motion'

interface BadgeDisplayProps {
  badges: { name: string; icon: string; earned: boolean }[]
}

const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-4"
    >
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl p-3 ${
            badge.earned ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <img src={badge.icon} alt={badge.name} className="w-8 h-8 mb-2" />
          <span className="text-xs text-center">{badge.name}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default BadgeDisplay