import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import FormErrors from '../ui/FormErrors.vue'
import { clearLocalStorage, mockLocalStorage } from '@/../vitest.setup'

describe('formErrors Component', () => {
  let wrapper: VueWrapper<any> | null
  const errors = ['someError', 'anotherError']

  beforeEach(() => {
    mockLocalStorage()
  })

  afterEach(() => {
    wrapper = null
    vitest.clearAllMocks()
    clearLocalStorage()
  })

  function createWrapper() {
    return mount(FormErrors, { props: { errors } })
  }

  const findAllByTestId = (testId: string) => wrapper?.findAll(`[data-test="${testId}"]`)

  describe('correctly renders errors props', () => {
    it('renders fullfilled errors', () => {
      wrapper = createWrapper()
      expect(findAllByTestId('error-item')?.map(el => el.text())).toEqual(errors)
    })
    it('hide list with empty errors', async () => {
      wrapper = createWrapper()
      wrapper.setProps({ errors: [] })
      await flushPromises()

      expect(findAllByTestId('error-item')?.length).toBe(0)
    })
  })
})
