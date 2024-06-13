import {  POST } from '@/shared/api';

class SignInService {
  register(username = '', password = '', email = '') {
    const options = {
      body: {
        user: {
          password,
          email,
          username
        }
      }
    }

    return POST('/users', options)
  }
  login(password = '', email = '') {
    const options = {
      body: {
        user: {
          password,
          email,
        }
      }
    }

    return POST('/users/login', options)
  }
}

export const signInService = new SignInService();