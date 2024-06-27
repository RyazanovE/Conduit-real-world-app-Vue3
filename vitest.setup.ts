import { type Router, createMemoryHistory, createRouter } from 'vue-router'

interface MockLocalStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
  length: number
  key: (index: number) => string | null
}

const mockedLocalStorage: MockLocalStorage = (() => {
  let store: { [key: string]: string } = {}
  let _length = 0

  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      if (!store[key]) {
        store[key] = value
        _length++
      }
    },
    removeItem: (key: string): void => {
      if (store[key]) {
        delete store[key]
        _length--
      }
    },
    clear: (): void => {
      store = {}
      _length = 0
    },
    get length(): number {
      return _length
    },
    key: (index: number): string | null => {
      const keys = Object.keys(store)
      return keys[index] || null
    },
  }
})()

export const token = 'some_token'

export function mockLocalStorage() {
  globalThis.localStorage = mockedLocalStorage
  localStorage.setItem('user', JSON.stringify({ token }))
}

export function createMockRouter(routes = []): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes,
  })
}
