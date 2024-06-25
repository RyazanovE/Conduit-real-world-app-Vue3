import type { AxiosResponse } from 'axios'
import { api } from '@/app/api/_index'
import { bindAll } from '@/shared/utils'
import type { LoginUserRequest, NewUserRequest, UserResponse } from '@/shared/models'

class SignInService {
  constructor() {
    bindAll(this)
  }

  register(username: string, password: string, email: string) {
    const body: NewUserRequest = {
      user: {
        email,
        password,
        username,
      },
    }

    return api.post<NewUserRequest, AxiosResponse<UserResponse>>('/users', body)
  }

  login(password: string, email: string) {
    const body: LoginUserRequest = {
      user: {
        password,
        email,
      },
    }

    return api.post<LoginUserRequest, AxiosResponse<UserResponse>>('/users/login', body)
  }
}

export const signInService = new SignInService()
