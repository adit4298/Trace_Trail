import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import LoadingSpinner from '@components/common/LoadingSpinner'

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
