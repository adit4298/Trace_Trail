import { api } from './api'
import type {
  LoginCredentials,
  SignupData,
  AuthResponse,
  User,
} from '@types/user.types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', credentials)
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/signup', data)
  }

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me')
  }

  async refreshToken(): Promise<{ access_token: string }> {
    return api.post<{ access_token: string }>('/auth/refresh')
  }

  logout() {
    // Clear local storage
    localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY || 'tracetrail_token')
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/forgot-password', { email })
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/reset-password', {
      token,
      new_password: newPassword,
    })
  }
}

export const authService = new AuthService()
