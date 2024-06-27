import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import FormErrors from '../ui/FormErrors.vue'

describe('formErrors Component', () => {
  let wrapper: VueWrapper<any>
  const errors = ['someError', 'anotherError']

  beforeEach(() => {
    wrapper = mount(FormErrors, { props: { errors } })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  const findAllByTestId = (testId: string) => wrapper.findAll(`[data-test="${testId}"]`)

  describe('correctly renders errors props', () => {
    it('renders fullfilled errors', () => {
      expect(findAllByTestId('error-item').map(el => el.text())).toEqual(errors)
    })
    it ('hide list with empty errors', async () => {
      wrapper.setProps({ errors: [] })
      await flushPromises()

      expect(findAllByTestId('error-item').length).toBe(0)
    })
  })
})
