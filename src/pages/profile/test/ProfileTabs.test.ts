import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vitest } from 'vitest'
import type { RouterLink } from 'vue-router'
import ProfileTabs from '../ui/ProfileTabs.vue'
import { routerLinkStub } from '@/shared/test'
import { RouteNames } from '@/app/routes'

let wrapper: VueWrapper<any> | null

const { useRouteMock } = vitest.hoisted(() => {
  return {
    useRouteMock: vitest.fn(),
  }
})

vitest.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as object
  return {
    ...actual,
    useRoute: useRouteMock,
  }
})

function createWrapper() {
  return shallowMount(ProfileTabs, {
    global: {
      stubs: {
        ...routerLinkStub,
      },
    },
  })
}

function findComponentByTestId<T>(testId: string) {
  return wrapper!.findComponent<T>(`[data-test="${testId}"]` as any)
}

describe('profileTabs Component', () => {
  afterEach(() => {
    wrapper = null
    vitest.clearAllMocks()
  })

  it('correctly renders links with right props and texts', async () => {
    const username = 'username'
    useRouteMock.mockReturnValue({ params: { username }, name: '' })
    wrapper = createWrapper()

    const myArticlesLink = findComponentByTestId<typeof RouterLink>('my-articles-link')
    const favoritedArticlesLink = findComponentByTestId<typeof RouterLink>('favorited-articles-link')
    expect(myArticlesLink.exists()).toBeTruthy()
    expect(favoritedArticlesLink.exists()).toBeTruthy()
    expect(myArticlesLink.props('to')).toEqual({ name: RouteNames.PROFILE, params: { username } })
    expect(favoritedArticlesLink.props('to')).toEqual({ name: RouteNames.PROFILE_FAVORITES, params: { username } })
  })
  it('renders links with correct classes on profile page', () => {
    const username = 'username'
    useRouteMock.mockReturnValue({ params: { username }, name: RouteNames.PROFILE })
    wrapper = createWrapper()

    const myArticlesLink = findComponentByTestId<typeof RouterLink>('my-articles-link')
    const favoritedArticlesLink = findComponentByTestId<typeof RouterLink>('favorited-articles-link')
    expect(myArticlesLink.classes()).toContain('active')
    expect(favoritedArticlesLink.classes()).not.toContain('active')
  })
  it('renders links with correct classes on favorite page', () => {
    const username = 'username'
    useRouteMock.mockReturnValue({ params: { username }, name: RouteNames.PROFILE_FAVORITES })
    wrapper = createWrapper()

    const myArticlesLink = findComponentByTestId<typeof RouterLink>('my-articles-link')
    const favoritedArticlesLink = findComponentByTestId<typeof RouterLink>('favorited-articles-link')
    expect(myArticlesLink.classes()).not.toContain('active')
    expect(favoritedArticlesLink.classes()).toContain('active')
  })
  it('correctly emits events by clicking on links', async () => {
    useRouteMock.mockReturnValue({ params: { username: 'username' } })
    wrapper = createWrapper()

    const myArticlesLink = findComponentByTestId<typeof RouterLink>('my-articles-link')
    const favoritedArticlesLink = findComponentByTestId<typeof RouterLink>('favorited-articles-link')
    await myArticlesLink.trigger('click')
    await favoritedArticlesLink.trigger('click')

    expect(wrapper.emitted('tabChanged')).toBeDefined()
    expect(wrapper.emitted('tabChanged')!.length).toBe(2)
    expect(wrapper.emitted('tabChanged')![0]![0]).toBe('profile')
    expect(wrapper.emitted('tabChanged')![1]![0]).toBe('profile-favorites')
  })
})
