import type { ProfileResponse } from '../models'
import { api } from '@/app/api/_index'
import { bindAll } from '@/shared/utils'

class ProfileApiService {
  constructor() {
    bindAll(this)
  }

  private getAuthorization() {
    let token = ''
    const user = localStorage.getItem('user')

    if (user) {
      token = JSON.parse(user).token
    }

    return token ? { Authorization: `Token ${token}` } : {}
  }

  getProfile(username: string) {
    const headers = this.getAuthorization()

    return api.get<ProfileResponse>(`/profiles/${username}`, { headers })
  }
}

export const profileApiService = new ProfileApiService()
