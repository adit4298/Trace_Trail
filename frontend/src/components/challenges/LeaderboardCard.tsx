import { motion } from 'framer-motion'

interface LeaderboardEntry {
  name: string
  score: number
  rank: number
}

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[]
}

const LeaderboardCard = ({ leaderboard }: LeaderboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3>Leaderboard</h3>
      <div className="mt-4">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-700 dark:text-gray-200">
                #{entry.rank}
              </span>
              <span>{entry.name}</span>
            </div>
            <span className="font-semibold text-blue-500">{entry.score} pts</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default LeaderboardCard