import type { AxiosResponse } from 'axios'
import { api } from '@/app/api/_index'
import { bindAll } from '@/shared/utils'
import type { UpdateUserRequest, UserResponse } from '@/shared/models'

class SettingsService {
  constructor() {
    bindAll(this)
  }

  private getAuthorization() {
    let token = ''
    const user = localStorage.getItem('user')

    if (user) {
      token = JSON.parse(user).token
    }

    return { Authorization: `Token ${token}` }
  }

  updateUser(user: UpdateUserRequest['user']) {
    const headers = this.getAuthorization()

    return api.put<UpdateUserRequest, AxiosResponse<UserResponse>>('/user/', { user }, { headers })
  }
}

export const settingsService = new SettingsService()
