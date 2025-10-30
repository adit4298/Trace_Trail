import { motion } from 'framer-motion'

interface SecuritySettingsProps {
  twoFactorEnabled: boolean
  onToggle2FA: () => void
}

const SecuritySettings = ({ twoFactorEnabled, onToggle2FA }: SecuritySettingsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4">Security</h3>
      <div className="flex items-center justify-between">
        <p>Two-Factor Authentication</p>
        <button
          onClick={onToggle2FA}
          className={`px-3 py-1 rounded-lg text-sm ${
            twoFactorEnabled
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400'
          } transition`}
        >
          {twoFactorEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </motion.div>
  )
}

export default SecuritySettings