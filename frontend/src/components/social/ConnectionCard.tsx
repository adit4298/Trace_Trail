import { motion } from 'framer-motion'
import { UserPlus, Trash2 } from 'lucide-react'

interface ConnectionCardProps {
  name: string
  platform: string
  connected: boolean
  onConnect: () => void
  onRemove: () => void
}

const ConnectionCard = ({
  name,
  platform,
  connected,
  onConnect,
  onRemove,
}: ConnectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex items-center justify-between"
    >
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{platform}</p>
      </div>

      {connected ? (
        <button
          onClick={onRemove}
          className="text-red-500 flex items-center gap-1 text-sm hover:text-red-600"
        >
          <Trash2 size={16} /> Remove
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="text-blue-500 flex items-center gap-1 text-sm hover:text-blue-600"
        >
          <UserPlus size={16} /> Connect
        </button>
      )}
    </motion.div>
  )
}

export default ConnectionCard