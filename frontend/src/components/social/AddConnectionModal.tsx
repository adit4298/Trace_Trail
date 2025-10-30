import { motion } from 'framer-motion'
import PlatformIcon from './PlatformIcon'

interface AddConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  platforms: string[]
  onConnect: (platform: string) => void
}

const AddConnectionModal = ({
  isOpen,
  onClose,
  platforms,
  onConnect,
}: AddConnectionModalProps) => {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-80"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-lg font-semibold mb-4">Add New Connection</h3>

        <div className="flex flex-col gap-3">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => onConnect(platform)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <PlatformIcon platform={platform} size={20} />
              <span className="capitalize">{platform}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )
}

export default AddConnectionModal