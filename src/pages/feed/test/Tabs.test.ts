import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import Tabs from '../ui/Tabs.vue'
import { clearLocalStorage, mockLocalStorage } from '@/../vitest.setup.ts'

let currentUseRouteMock = {
  query: {
    source: '',
  },
}
const push = vitest.fn()

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object
  return {
    ...actual,
    useRouter: vitest.fn(() => ({ push })),
    useRoute: vitest.fn(() => currentUseRouteMock),
  }
})

describe('popularTags component', () => {
  let wrapper: VueWrapper<any> | null

  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    clearLocalStorage()
    vitest.restoreAllMocks()
  })

  function createWrapper() {
    return mount(Tabs)
  }

  const findByTestId = (testId: string) => wrapper?.find(`[data-test="${testId}"]`)

  describe('"Your Feed" button', () => {
    it('shows button with fullfilled current user without active class', async () => {
      currentUseRouteMock = { query: { source: '' } }
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('your-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('your-feed-button')?.classes()).not.toContain('active')
    })
    it('shows button with fullfilled current user with active class', async () => {
      currentUseRouteMock = { query: { source: 'my-feed' } }
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('your-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('your-feed-button')?.classes()).toContain('active')
    })
    it('correctly navigates by click', async () => {
      const params = { someParams: 'someParams' }
      currentUseRouteMock = { query: { source: '' }, params } as any
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('your-feed-button')?.exists()).toBeTruthy()
      await (findByTestId('your-feed-button'))?.trigger('click')

      expect(push).toHaveBeenCalledOnce()
      expect(push).toHaveBeenCalledWith({ query: { source: 'my-feed' }, params })
    })
  })

  describe('"Global feed" button', () => {
    it('shows button with active class', async () => {
      currentUseRouteMock = { query: {} } as any
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('global-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('global-feed-button')?.classes()).toContain('active')
    })
    it('shows button without active class with fullfilled query source', async () => {
      currentUseRouteMock = { query: { source: 'my-feed' } }
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('global-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('global-feed-button')?.classes()).not.toContain('active')
    })
    it('shows button without active class with fullfilled query tag', async () => {
      currentUseRouteMock = { query: { tag: 'some-tag' } } as any
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('global-feed-button')?.exists()).toBeTruthy()
      expect(findByTestId('global-feed-button')?.classes()).not.toContain('active')
    })
    it('correctly navigates by click', async () => {
      const params = { someParams: 'someParams' }
      currentUseRouteMock = { query: { source: '' }, params } as any
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('global-feed-button')?.exists()).toBeTruthy()
      await (findByTestId('global-feed-button'))?.trigger('click')

      expect(push).toHaveBeenCalledOnce()
      expect(push).toHaveBeenCalledWith({ query: { source: undefined }, params })
    })
  })
  describe('"Tag link" span', () => {
    it('shows link with fullfiled query tag', async () => {
      const tag = 'some-tag'
      currentUseRouteMock = { query: { tag } } as any
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('tag-link')?.exists()).toBeTruthy()
      expect(findByTestId('tag-link')?.text()).toBe(tag)
    })
    it('hides without fullfilled query tag', async () => {
      currentUseRouteMock = { query: {} } as any
      wrapper = createWrapper()
      await nextTick()

      expect(findByTestId('tag-link')?.exists()).toBeFalsy()
    })
  })
})
