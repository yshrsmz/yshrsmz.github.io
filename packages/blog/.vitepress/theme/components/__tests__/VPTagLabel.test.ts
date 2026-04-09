import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import VPTagLabel from '../VPTagLabel.vue'

test('VPTagLabel renders expected HTML', () => {
  const wrapper = mount(VPTagLabel, {
    props: { link: '/tags/vue', name: 'vue' },
  })

  expect(wrapper.html()).toMatchSnapshot()
})
