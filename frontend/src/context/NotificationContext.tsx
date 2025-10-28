import { createContext, useState, useCallback, ReactNode, useContext } from 'react'
import Toast from '@components/common/Toast'
import { AnimatePresence, motion } from 'framer-motion'

export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type: Notification['type'], duration?: number) => void
  removeNotification: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  clearAll: () => void
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }, [])

  const addNotification = useCallback(
    (message: string, type: Notification['type'] = 'info', duration: number = 5000) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const notification: Notification = { id, message, type, duration }

      setNotifications((prev) => [notification, ...prev].slice(0, 5)) // limit to 5

      if (duration > 0) {
        setTimeout(() => removeNotification(id), duration)
      }
    },
    [removeNotification]
  )

  const success = useCallback(
    (message: string, duration?: number) => addNotification(message, 'success', duration),
    [addNotification]
  )

  const error = useCallback(
    (message: string, duration?: number) => addNotification(message, 'error', duration),
    [addNotification]
  )

  const info = useCallback(
    (message: string, duration?: number) => addNotification(message, 'info', duration),
    [addNotification]
  )

  const warning = useCallback(
    (message: string, duration?: number) => addNotification(message, 'warning', duration),
    [addNotification]
  )

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        info,
        warning,
        clearAll,
      }}
    >
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Toast {...notification} onClose={() => removeNotification(notification.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}
