export interface Challenge {
  id: number
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  points: number
  estimated_time: string
  category: string
  icon: string
  is_completed: boolean
  progress?: number
}

export interface ChallengeProgress {
  challenge_id: number
  user_id: number
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  started_at?: string
  completed_at?: string
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  earned_at?: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface Leaderboard {
  current_user_rank: number
  top_users: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  rank: number
  username: string
  points: number
  badges_earned: number
  avatar_url?: string
}
