import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vitest } from 'vitest'
import type { RouterLink } from 'vue-router'
import ProfileTabs from '../ui/ProfileTabs.vue'

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
        'router-link': {
          template: '<a data-test="img-profile-link" :href="to" @click.prevent="() => {}" ><slot></slot></a>',
          props: ['to'],
        },
      },
    },
  })
}

function findComponentByTestId<T>(testId: string) {
  return wrapper?.findComponent<T>(`[data-test="${testId}"]` as any)
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
    expect(myArticlesLink?.exists()).toBeTruthy()
    expect(favoritedArticlesLink?.exists()).toBeTruthy()
    expect(myArticlesLink?.props('to')).toEqual({ name: 'profile', params: { username } })
    expect(favoritedArticlesLink?.props('to')).toEqual({ name: 'profile-favorites', params: { username } })
  })
  it('renders links with correct classes on profile page', () => {
    const username = 'username'
    const name = 'profile'
    useRouteMock.mockReturnValue({ params: { username }, name })
    wrapper = createWrapper()

    const myArticlesLink = findComponentByTestId<typeof RouterLink>('my-articles-link')
    const favoritedArticlesLink = findComponentByTestId<typeof RouterLink>('favorited-articles-link')
    expect(myArticlesLink?.classes()).toContain('active')
    expect(favoritedArticlesLink?.classes()).not.toContain('active')
  })
  it('renders links with correct classes on favorite page', () => {
    const username = 'username'
    const name = 'profile-favorites'
    useRouteMock.mockReturnValue({ params: { username }, name })
    wrapper = createWrapper()

    const myArticlesLink = findComponentByTestId<typeof RouterLink>('my-articles-link')
    const favoritedArticlesLink = findComponentByTestId<typeof RouterLink>('favorited-articles-link')
    expect(myArticlesLink?.classes()).not.toContain('active')
    expect(favoritedArticlesLink?.classes()).toContain('active')
  })
  it('correctly emits events by clicking on links', async () => {
    useRouteMock.mockReturnValue({ params: { username: 'username' } })
    wrapper = createWrapper()

    const myArticlesLink = findComponentByTestId<typeof RouterLink>('my-articles-link')
    const favoritedArticlesLink = findComponentByTestId<typeof RouterLink>('favorited-articles-link')
    await myArticlesLink?.trigger('click')
    await favoritedArticlesLink?.trigger('click')

    expect(wrapper.emitted('tabChanged')).toBeDefined()
    expect(wrapper.emitted('tabChanged')!.length).toBe(2)
    expect(wrapper.emitted('tabChanged')![0]![0]).toBe('profile')
    expect(wrapper.emitted('tabChanged')![1]![0]).toBe('profile-favorites')
  })
})
