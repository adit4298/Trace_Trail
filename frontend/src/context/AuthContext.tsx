import { createContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@services/authService'
import type { User, SignupData } from '@types/user.types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(
          import.meta.env.VITE_TOKEN_KEY || 'tracetrail_token'
        )
        if (token) {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY || 'tracetrail_token')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    setUser(response.user)
    localStorage.setItem(
      import.meta.env.VITE_TOKEN_KEY || 'tracetrail_token',
      response.access_token
    )
  }

  const signup = async (data: SignupData) => {
    const response = await authService.signup(data)
    setUser(response.user)
    localStorage.setItem(
      import.meta.env.VITE_TOKEN_KEY || 'tracetrail_token',
      response.access_token
    )
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY || 'tracetrail_token')
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
