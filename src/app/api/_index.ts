import axios from 'axios'
import router from '../routes/_index'
import { RouteNames } from '../routes'
import { AUTH_REQUIRED_URLS, BASE_URL } from '@/shared/config'
import { getUserToken } from '@/shared/utils'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getUserToken()
    const isAuthRequiredUrl = AUTH_REQUIRED_URLS.some(url => config.url?.includes(url))
    const isAuthRequired = isAuthRequiredUrl && !token

    if (isAuthRequired) {
      router.push({ name: RouteNames.LOGIN })
      return Promise.reject(new Error('No token available'))
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export { api }
