import { api } from './api'
import type {
  SocialConnection,
  AddConnectionData,
  SyncStatus,
} from '@types/api.types'

class ConnectionService {
  async getConnections(): Promise<SocialConnection[]> {
    return api.get<SocialConnection[]>('/connections')
  }

  async addConnection(data: AddConnectionData): Promise<SocialConnection> {
    return api.post<SocialConnection>('/connections', data)
  }

  async deleteConnection(id: number): Promise<void> {
    return api.delete(`/connections/${id}`)
  }

  async syncConnection(id: number): Promise<SyncStatus> {
    return api.post<SyncStatus>(`/connections/${id}/sync`)
  }

  async updateConnectionSettings(
    id: number,
    settings: Partial<SocialConnection>
  ): Promise<SocialConnection> {
    return api.put<SocialConnection>(`/connections/${id}`, settings)
  }
}

export const connectionService = new ConnectionService()
