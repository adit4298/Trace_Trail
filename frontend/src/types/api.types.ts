export interface SocialConnection {
  id: number
  user_id: number
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin'
  platform_username: string
  connected_at: string
  is_active: boolean
  last_synced?: string
  post_count: number
  follower_count: number
  privacy_setting: 'public' | 'friends' | 'private'
}

export interface AddConnectionData {
  platform: string
  platform_username: string
  access_token?: string
}

export interface SyncStatus {
  status: 'syncing' | 'completed' | 'failed'
  message: string
  last_synced: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  timestamp: string
}

export interface ApiError {
  detail: string
  error_code?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  pages: number
}
