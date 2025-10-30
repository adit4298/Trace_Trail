import { motion } from 'framer-motion'
import ChallengeCard from './ChallengeCard'

interface Challenge {
  id: number
  title: string
  description: string
  progress: number
  reward: string
}

interface ChallengeListProps {
  challenges: Challenge[]
}

const ChallengeList = ({ challenges }: ChallengeListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} {...challenge} />
      ))}
    </motion.div>
  )
}

export default ChallengeList