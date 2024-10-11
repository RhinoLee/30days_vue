import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useInfiniteScroll } from '@/compositions/useInfiniteScroll'
import { useElementVisibility } from '@/compositions/useElementVisibility'

vi.mock('@/compositions/useElementVisibility')
describe('useInfiniteScroll', () => {
  it('should be defined', () => {
    expect(useInfiniteScroll).toBeDefined()
  })

  it.each([
    [ref(givenMockElement())],
    [givenMockElement()],
    [document],
    [window],
  ])('should calls the loadMore handler, when element is visible', (target) => {
    const mockHandler = vi.fn()
    givenElementVisibilityRefMock(true)

    useInfiniteScroll(target, mockHandler)

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should calls the loadMore handler, when element visibility state from hidden to visible', async () => {
    const mockHandler = vi.fn()
    const mockElement = givenMockElement()
    const visibilityRefMock = givenElementVisibilityRefMock(false)

    useInfiniteScroll(mockElement, mockHandler)

    expect(mockHandler).not.toHaveBeenCalled()

    visibilityRefMock.value = true
    await flushPromises()

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  it('should call the loadMore handler, when user scrolls', async () => {
    const mockElementScrollHeight = 100
    const mockHandler = vi.fn()
    const mockElement = givenMockElement({
      scrollHeight: mockElementScrollHeight,
    })
    givenElementVisibilityRefMock(true)

    useInfiniteScroll(mockElement, mockHandler)
    mockElement.scrollTop = mockElementScrollHeight
    mockElement.dispatchEvent(new Event('scroll'))
    await flushPromises()

    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  function givenMockElement({
    scrollHeight = 0,
  } = {}) {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'scrollHeight', {
      value: scrollHeight,
    })
    return mockElement
  }

  function givenElementVisibilityRefMock(defaultValue) {
    const mockVisibilityRef = ref(defaultValue)

    // TS
    // vi.mocked(useElementVisibility).mockReturnValue(mockVisibilityRef)

    // JS
    useElementVisibility.mockReturnValue(mockVisibilityRef)

    return mockVisibilityRef
  }
})
