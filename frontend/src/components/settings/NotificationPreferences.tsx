import { motion } from 'framer-motion'

interface NotificationPreferencesProps {
  emailNotifications: boolean
  pushNotifications: boolean
  onToggleEmail: () => void
  onTogglePush: () => void
}

const NotificationPreferences = ({
  emailNotifications,
  pushNotifications,
  onToggleEmail,
  onTogglePush,
}: NotificationPreferencesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4">Notifications</h3>

      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between">
          <span>Email Notifications</span>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={onToggleEmail}
            className="w-5 h-5"
          />
        </label>

        <label className="flex items-center justify-between">
          <span>Push Notifications</span>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={onTogglePush}
            className="w-5 h-5"
          />
        </label>
      </div>
    </motion.div>
  )
}

export default NotificationPreferences