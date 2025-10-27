export interface User {
  id: number
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  username: string
  full_name: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface UserProfile extends User {
  bio?: string
  avatar_url?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications_enabled: boolean
  email_notifications: boolean
  language: string
}
