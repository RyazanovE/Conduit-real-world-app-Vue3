import axios from 'axios'
import router from '../routes/_index'
import { backendBaseUrl } from '@/shared/config'

const api = axios.create({
  baseURL: backendBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    let token = ''
    const user = localStorage.getItem('user')

    if (user) {
      token = JSON.parse(user).token
    }
    const noAuthUrls = [
      '/users',
      '/users/login',
      '/articles',
      '/tags',
    ]
    const isAuthRequired = config.url && !noAuthUrls.includes(config.url)

    if (isAuthRequired && !token) {
      sessionStorage.removeItem('user')
      router.push({ name: 'login' })
      return Promise.reject(new Error('No token available'))
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export { api }
