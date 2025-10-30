import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface ActionButtonProps {
  onClick: () => void
}

const ActionButton = ({ onClick }: ActionButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 text-sm hover:bg-blue-600 transition"
    >
      Take Action <ArrowRight size={16} />
    </motion.button>
  )
}

export default ActionButton