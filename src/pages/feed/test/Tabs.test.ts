import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import Tabs from '../ui/Tabs.vue'
import { clearLocalStorage, mockLocalStorage } from '@/../vitest.setup.ts'

let wrapper: VueWrapper<any> | null

const { useRouteMock, pushMock } = vitest.hoisted(() => {
  return {
    useRouteMock: vitest.fn(),
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

function findByTestId(testId: string) {
  return wrapper?.find(`[data-test="${testId}"]`)
}

function createWrapper() {
  return shallowMount(Tabs)
}

describe('popularTags component', () => {
  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    clearLocalStorage()
    vitest.restoreAllMocks()
  })

  describe('"Your Feed" button', () => {
    it('shows button with fullfilled current user without active class', async () => {
      useRouteMock.mockReturnValue({ query: { source: '' } })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('your-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('your-feed-button')?.classes()).not.toContain('active')
    })
    it('shows button with fullfilled current user with active class', async () => {
      useRouteMock.mockReturnValue({ query: { source: 'my-feed' } })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('your-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('your-feed-button')?.classes()).toContain('active')
    })
    it('correctly navigates by click', async () => {
      const params = { someParams: 'someParams' }
      useRouteMock.mockReturnValue({ query: { source: '' }, params })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('your-feed-button')?.exists()).toBeTruthy()
      await (findByTestId('your-feed-button'))?.trigger('click')

      expect(pushMock).toHaveBeenCalledOnce()
      expect(pushMock).toHaveBeenCalledWith({ query: { source: 'my-feed' }, params })
    })
  })

  describe('"Global feed" button', () => {
    it('shows button with active class', async () => {
      useRouteMock.mockReturnValue({ query: {} })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('global-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('global-feed-button')?.classes()).toContain('active')
    })
    it('shows button without active class with fullfilled query source', async () => {
      useRouteMock.mockReturnValue({ query: { source: 'my-feed' } })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('global-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('global-feed-button')?.classes()).not.toContain('active')
    })
    it('shows button without active class with fullfilled query tag', async () => {
      useRouteMock.mockReturnValue({ query: { tag: 'some-tag' } })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('global-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('global-feed-button')?.classes()).not.toContain('active')
    })
    it('correctly navigates by click', async () => {
      const params = { someParams: 'someParams' }
      useRouteMock.mockReturnValue({ query: { source: '' }, params })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('global-feed-button')?.exists()).toBeTruthy()
      await (findByTestId('global-feed-button'))?.trigger('click')

      expect(pushMock).toHaveBeenCalledOnce()
      expect(pushMock).toHaveBeenCalledWith({ query: { source: undefined }, params })
    })
  })
  describe('"Tag link" span', () => {
    it('shows link with fullfiled query tag', async () => {
      const tag = 'some-tag'
      useRouteMock.mockReturnValue({ query: { tag } })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('tag-link')?.exists()).toBeTruthy()
      expect(findByTestId('tag-link')?.text()).toBe(tag)
    })
    it('hides without fullfilled query tag', async () => {
      useRouteMock.mockReturnValue({ query: {} })
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('tag-link')?.exists()).toBeFalsy()
    })
  })
})
