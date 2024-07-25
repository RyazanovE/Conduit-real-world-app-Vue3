import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import { nextTick } from 'vue'
import Settings from '../ui/Settings.vue'
import { authFetchOptions, clearLocalStorage, mockLocalStorage, user } from '@/../vitest.setup'
import { api } from '@/app/api/_index'

let wrapper: VueWrapper<any> | null

const { useRouteMock, pushMock } = vitest.hoisted(() => {
  return {
    useRouteMock: vitest.fn(() => ({ name: 'settings' })),
    pushMock: vitest.fn(),
  }
})

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object
  return {
    ...actual,
    useRouter: vitest.fn(() => ({ push: pushMock })),
    useRoute: useRouteMock,
  }
})

function createWrapper() {
  return shallowMount(Settings)
}

describe('settings component', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    clearLocalStorage()
    vi.restoreAllMocks()
  })

  function getElementById(testId: string) {
    return wrapper!.get(`[data-test="${testId}"]` as any)
  }

  it('logging out by logout button click', async () => {
    wrapper = createWrapper()

    expect(globalThis.localStorage.getItem('user')).toBeDefined()

    await getElementById('logout-button').trigger('click')

    expect(globalThis.localStorage.getItem('user')).toBeNull()
    expect(pushMock).toHaveBeenCalledOnce()
    expect(pushMock).toHaveBeenCalledWith({ name: 'feed' })
  })
  it('showing validation error with uncorrect formFields', async () => {
    vitest.spyOn(console, 'error').mockImplementation(() => { })
    const put = vitest.spyOn(api, 'put').mockResolvedValue({
      data: { user: { email: 'some-email', username: 'some-username' } },
      status: 200,
    })

    wrapper = createWrapper()
    const errorMessages = [
      'Email is required',
      'Username is required',
    ]

    const { onSubmit } = wrapper.vm
    expect(wrapper.findAll('[data-test="error-message"]')).toHaveLength(0)
    expect(JSON.parse(localStorage.getItem('user') ?? '')).toEqual(user)

    onSubmit({ email: 'email' })
    await nextTick()

    expect(wrapper.findAll('[data-test="error-message"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="error-message"]').map(el => el.text())).toContain('Username is required')

    onSubmit({ username: 'username' })
    await nextTick()

    expect(wrapper.findAll('[data-test="error-message"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="error-message"]').map(el => el.text())).toContain('Email is required')

    onSubmit({})
    await nextTick()

    expect(wrapper.findAll('[data-test="error-message"]')).toHaveLength(2)
    expect(wrapper.findAll('[data-test="error-message"]').map(el => el.text())).toEqual(errorMessages)

    expect(put).not.toHaveBeenCalled()

    onSubmit({ email: 'some-email', username: 'some-username' })
    await flushPromises()
    expect(wrapper.findAll('[data-test="error-message"]')).toHaveLength(0)
    expect(put).toHaveBeenCalledOnce()
    expect(put).toHaveBeenCalledWith('/user/', { user: { email: 'some-email', username: 'some-username' } }, authFetchOptions)
    expect(pushMock).toHaveBeenCalledOnce()
    expect(pushMock).toHaveBeenCalledWith({ name: 'profile', params: { username: 'some-username' } })
    expect(JSON.parse(localStorage.getItem('user') ?? '')).toEqual({ email: 'some-email', username: 'some-username' })
  })
})
