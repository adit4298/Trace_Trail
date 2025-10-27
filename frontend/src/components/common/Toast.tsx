import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import type { Toast as ToastType } from '@hooks/useToast'

interface ToastProps extends ToastType {
  onClose: (id: string) => void
}

const Toast = ({ id, message, type, duration, onClose }: ToastProps) => {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  }

  const styles = {
    success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200',
    error: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }

  return (
    <div
      className={`flex items-center justify-between w-full max-w-sm border-l-4 rounded-lg shadow-md px-4 py-3 ${styles[type]}`}
    >
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-sm font-medium">{message}</p>
      </div>

      <button onClick={() => onClose(id)} className="ml-4 hover:opacity-70">
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast
