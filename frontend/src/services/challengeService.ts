import { api } from './api'
import type {
  Challenge,
  ChallengeProgress,
  Badge,
  Leaderboard,
} from '@types/challenge.types'

class ChallengeService {
  async getChallenges(): Promise<Challenge[]> {
    return api.get<Challenge[]>('/challenges')
  }

  async getChallengeById(id: number): Promise<Challenge> {
    return api.get<Challenge>(`/challenges/${id}`)
  }

  async startChallenge(id: number): Promise<ChallengeProgress> {
    return api.post<ChallengeProgress>(`/challenges/${id}/start`)
  }

  async completeChallenge(id: number): Promise<ChallengeProgress> {
    return api.post<ChallengeProgress>(`/challenges/${id}/complete`)
  }

  async getProgress(): Promise<ChallengeProgress[]> {
    return api.get<ChallengeProgress[]>('/challenges/progress')
  }

  async getBadges(): Promise<Badge[]> {
    return api.get<Badge[]>('/challenges/badges')
  }

  async getLeaderboard(): Promise<Leaderboard> {
    return api.get<Leaderboard>('/challenges/leaderboard')
  }
}

export const challengeService = new ChallengeService()
