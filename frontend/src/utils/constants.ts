// ==============================
// API Endpoints
// ==============================
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  DASHBOARD: '/dashboard',
  CONNECTIONS: '/connections',
  CHALLENGES: '/challenges',
  ANALYSIS: '/analysis',
  RECOMMENDATIONS: '/recommendations',
} as const

// ==============================
// Risk Categories
// ==============================
export const RISK_CATEGORIES = {
  LOW: { min: 0, max: 40, color: 'success', label: 'Low Risk' },
  MEDIUM: { min: 41, max: 70, color: 'warning', label: 'Medium Risk' },
  HIGH: { min: 71, max: 100, color: 'danger', label: 'High Risk' },
} as const

// ==============================
// Social Media Platforms
// ==============================
export const PLATFORMS = {
  FACEBOOK: { name: 'Facebook', icon: 'facebook', color: '#1877F2' },
  INSTAGRAM: { name: 'Instagram', icon: 'instagram', color: '#E4405F' },
  TWITTER: { name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
  LINKEDIN: { name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2' },
} as const

// ==============================
// Challenge Difficulties
// ==============================
export const DIFFICULTIES = {
  BEGINNER: { label: 'Beginner', color: 'green', points: 10 },
  INTERMEDIATE: { label: 'Intermediate', color: 'blue', points: 25 },
  ADVANCED: { label: 'Advanced', color: 'orange', points: 50 },
  EXPERT: { label: 'Expert', color: 'red', points: 100 },
} as const

// ==============================
// Local Storage Keys
// ==============================
export const STORAGE_KEYS = {
  TOKEN: 'tracetrail_token',
  REFRESH_TOKEN: 'tracetrail_refresh_token',
  USER: 'tracetrail_user',
  THEME: 'tracetrail_theme',
} as const
