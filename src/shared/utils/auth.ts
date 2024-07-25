import type { User } from '../models'

export const getUser = function () {
  let user: User | null = null
  const unparsedUser = localStorage.getItem('user')

  if (unparsedUser) {
    user = JSON.parse(unparsedUser) as User
  }
  return user
}

export const getUserToken = function () {
  const user = getUser()

  return user?.token ?? null
}
