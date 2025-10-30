import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

interface SyncStatusProps {
  status: 'syncing' | 'success' | 'error'
  message?: string
}

const SyncStatus = ({ status, message }: SyncStatusProps) => {
  const getIcon = () => {
    switch (status) {
      case 'syncing':
        return <Loader2 className="text-blue-500 animate-spin" size={20} />
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />
      case 'error':
        return <XCircle className="text-red-500" size={20} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-sm mt-2"
    >
      {getIcon()}
      <span>{message || status}</span>
    </motion.div>
  )
}

export default SyncStatus